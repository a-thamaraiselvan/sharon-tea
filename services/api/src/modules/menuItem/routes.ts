import { Router } from 'express';
import { menuItemController, formatPublicMenuItem } from './controller.js';
import { productController, formatPublicProduct } from '../product/controller.js';
import { menuItemService } from './service.js';
import { productService } from '../product/service.js';
import { authenticate, optionalAuthenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { successResponse } from '../../utils/response.js';

const router = Router();

// Dispatcher for public products
const handleGetPublicProducts = (req: any, res: any, next: any) => {
  if (req.query.type === 'retail') {
    return productController.getPublic(req, res, next);
  }
  return menuItemController.getPublic(req, res, next);
};

// Dispatcher for admin products list
const handleGetProducts = (req: any, res: any, next: any) => {
  if (req.query.type === 'retail') {
    return productController.getAll(req, res, next);
  }
  return menuItemController.getAll(req, res, next);
};

// Hybrid list handler
const handleList = (req: any, res: any, next: any) => {
  if (req.user && (req.user.role === 'ADMIN' || req.user.role === 'STAFF')) {
    return handleGetProducts(req, res, next);
  }
  return handleGetPublicProducts(req, res, next);
};

// Unified GetProductById (checks menu items first, then retail products)
const handleGetProductById = async (req: any, res: any, next: any) => {
  try {
    const id = req.params.id as string;
    const isAdmin = req.user && (req.user.role === 'ADMIN' || req.user.role === 'STAFF');
    try {
      const item = await menuItemService.getItemById(id);
      return successResponse(
        res,
        isAdmin ? item : formatPublicMenuItem(item),
        'Product retrieved'
      );
    } catch {
      const product = await productService.getProductById(id);
      return successResponse(
        res,
        isAdmin ? product : formatPublicProduct(product),
        'Product retrieved'
      );
    }
  } catch (err) {
    next(err);
  }
};

// Unified CreateProduct
const handleCreateProduct = (req: any, res: any, next: any) => {
  if (req.body.type === 'retail' || req.body.pack_size || req.body.packSize) {
    return productController.create(req, res, next);
  }
  return menuItemController.create(req, res, next);
};

// Unified UpdateProduct
const handleUpdateProduct = async (req: any, res: any, next: any) => {
  const id = req.params.id as string;
  try {
    const item = await menuItemService.updateItem(id, req.body);
    return successResponse(res, item, 'Product updated successfully');
  } catch {
    return productController.update(req, res, next);
  }
};

// Unified UpdateProductAvailability
const handleUpdateAvailability = async (req: any, res: any, next: any) => {
  const id = req.params.id as string;
  try {
    const item = await menuItemService.toggleAvailability(id, req.body.isAvailable);
    return successResponse(res, item, 'Availability updated successfully');
  } catch {
    return productController.update(req, res, next);
  }
};

// Unified DeleteProduct
const handleDeleteProduct = async (req: any, res: any, next: any) => {
  const id = req.params.id as string;
  try {
    await menuItemService.deleteItem(id);
    return successResponse(res, null, 'Product deleted successfully');
  } catch {
    return productController.delete(req, res, next);
  }
};

// Grandma's Ladle PascalCase endpoints
router.get('/GetPublicProducts', handleGetPublicProducts);
router.get('/GetProducts', authenticate, authorize('ADMIN', 'STAFF'), handleGetProducts);
router.get('/GetProductById/:id', optionalAuthenticate, handleGetProductById);
router.post('/CreateProduct', authenticate, authorize('ADMIN'), handleCreateProduct);
router.put('/UpdateProduct/:id', authenticate, authorize('ADMIN'), handleUpdateProduct);
router.patch('/UpdateProductAvailability/:id', authenticate, authorize('ADMIN', 'STAFF'), handleUpdateAvailability);
router.put('/UpdateProductAvailability/:id', authenticate, authorize('ADMIN', 'STAFF'), handleUpdateAvailability);
router.delete('/DeleteProduct/:id', authenticate, authorize('ADMIN'), handleDeleteProduct);

// Root / Fallback routes
router.get('/public', handleGetPublicProducts);
router.get('/', optionalAuthenticate, handleList);
router.get('/:id', optionalAuthenticate, handleGetProductById);
router.post('/', authenticate, authorize('ADMIN'), handleCreateProduct);
router.put('/:id', authenticate, authorize('ADMIN'), handleUpdateProduct);
router.patch('/:id/availability', authenticate, authorize('ADMIN', 'STAFF'), handleUpdateAvailability);
router.put('/:id/availability', authenticate, authorize('ADMIN', 'STAFF'), handleUpdateAvailability);
router.delete('/:id', authenticate, authorize('ADMIN'), handleDeleteProduct);

export default router;

import { Router } from 'express';
import * as controlador from '../controllers/libros.controller.js';
import { requiereAutenticacion } from '../middlewares/requiereAutenticacion.js';

const router = Router();
router.use(requiereAutenticacion);

router.get('/', controlador.listar);
router.get('/:id', controlador.obtener);
router.post('/', controlador.crear);
router.patch('/:id/estado', controlador.cambiarEstado);
router.put('/:id', controlador.actualizar);
router.delete('/:id', controlador.eliminar);

export default router;

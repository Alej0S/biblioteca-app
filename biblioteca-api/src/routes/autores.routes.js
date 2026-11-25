import { Router } from 'express';
import * as controlador from '../controllers/autores.controller.js';
import { requiereAutenticacion } from '../middlewares/requiereAutenticacion.js';

const router = Router();
router.use(requiereAutenticacion); // protege TODAS las rutas de autores

router.get('/', controlador.listar);
router.get('/:id', controlador.obtener);
router.post('/', controlador.crear);
router.put('/:id', controlador.actualizar);
router.delete('/:id', controlador.eliminar);

export default router;

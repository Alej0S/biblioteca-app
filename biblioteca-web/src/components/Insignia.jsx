import { ESTADOS } from '../datos/estados';

export default function Insignia({ estado }) {
  const texto = ESTADOS.find((e) => e.valor === estado)?.texto ?? estado;
  return <span className={`insignia insignia-${estado}`}>{texto}</span>;
}

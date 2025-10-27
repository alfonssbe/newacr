import Image from "next/image";
import styles from '@/app/css/styles.module.css'

export const Loader = () => {
  return <div className={styles.iconCSS} ><Image alt="ACR Speaker Logo" src={'/images/acr/acr-icon.svg'} priority
  fill
  style={{ objectFit: 'contain' }}/></div>
};

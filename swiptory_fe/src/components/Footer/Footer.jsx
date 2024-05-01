import styles from './Footer.module.css';

const Footer = () => {
    return (
        <div className={styles.mainContainer}>
            Made With ❤️ by
            <a className={styles.link} href='https://www.linkedin.com/in/adityasharma-dev/'>{`Aditya Sharma.`}</a>
        </div>
    );
};

export default Footer;

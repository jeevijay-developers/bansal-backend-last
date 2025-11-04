import React from 'react';
import { Oval } from 'react-loader-spinner';

interface LoaderWithBackgroundProps {
  visible: boolean;
}

const LoaderWithBackground: React.FC<LoaderWithBackgroundProps> = ({ visible }) => {
  return (
    visible && (
      <div style={styles.overlay}>
        <Oval
          visible={visible}
          height={80}
          width={80}
          ariaLabel="oval-loading"
          wrapperStyle={{}}
          wrapperClass="vortex-wrapper"
          color="#ff693d"
          secondaryColor='#6E31AE'
          // colors={['#ff693d', '#6E31AE', '#FFDA49', '#407CFF', '#2F9356', '#01202B']}
        />
      </div>
    )
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', 
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, 
  },
};

export default LoaderWithBackground;

const LoadingSpinner = ({ message }) => {
  return (
    <div className='text-center'>
      <div className='spinner-border text-stabraq' role='status'>
        <span className='visually-hidden'>Loading...</span>
      </div>
      {message && (
        <div style={{ color: 'var(--stabraq-muted, #aaa)', fontSize: '0.85rem', marginTop: '8px' }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;

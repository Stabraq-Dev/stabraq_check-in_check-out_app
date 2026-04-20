const SelectionModal = ({ title, options, selectedValue, onSelect, onClose, isOpen, renderItem, groupBy }) => {
  if (!isOpen) return null;

  const filteredOptions = options.filter((o) => o.value);

  const renderOptions = () => {
    if (!groupBy) {
      return filteredOptions.map((option) => (
        <div
          key={option.key}
          className={`selection-modal-item ${selectedValue === option.value ? 'active' : ''}`}
          onClick={() => {
            onSelect(option.value);
            onClose();
          }}
        >
          {renderItem ? renderItem(option) : option.text}
        </div>
      ));
    }

    // Group options by groupBy function
    const elements = [];
    let lastGroup = null;
    filteredOptions.forEach((option) => {
      const group = groupBy(option);
      if (group !== lastGroup) {
        elements.push(
          <div key={`group-${group}`} className='selection-modal-group'>
            {group}
          </div>
        );
        lastGroup = group;
      }
      elements.push(
        <div
          key={option.key}
          className={`selection-modal-item ${selectedValue === option.value ? 'active' : ''}`}
          onClick={() => {
            onSelect(option.value);
            onClose();
          }}
        >
          {renderItem ? renderItem(option) : option.text}
        </div>
      );
    });
    return elements;
  };

  return (
    <div className='selection-modal-overlay' onClick={onClose}>
      <div className='selection-modal' onClick={(e) => e.stopPropagation()}>
        <div className='selection-modal-header'>
          <span>{title}</span>
          <button onClick={onClose} aria-label='Close'>
            <i className='close icon' />
          </button>
        </div>
        <div className='selection-modal-body'>
          {renderOptions()}
        </div>
      </div>
    </div>
  );
};

export default SelectionModal;

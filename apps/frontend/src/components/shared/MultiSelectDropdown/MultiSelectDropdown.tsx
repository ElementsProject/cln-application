import './MultiSelectDropdown.scss';
import { useState, useRef, useEffect, useCallback, memo } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { motion, AnimatePresence } from 'framer-motion';
import { CloseSVG } from '../../../svgs/Close';
import { ChevronSVG } from '../../../svgs/Chevron';
import { itemVariants, dropdownVariants, badgeVariants, FilterMode } from '../../../utilities/constants';
import { Badge, Button, Form, InputGroup } from 'react-bootstrap';

export interface SelectOption {
  value: string;
  label: string;
}

interface MultiSelectDropdownProps {
  options: SelectOption[];
  selectedOptions?: string[];
  filterMode?: FilterMode;
  onChange?: (selectedOptions: string[], filterMode: FilterMode) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

const MultiSelectDropdown = ({
  options,
  selectedOptions,
  filterMode: initialFilterMode,
  onChange,
  placeholder = 'Select...',
  className = '',
  id,
}: MultiSelectDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>(selectedOptions ?? []);
  const [filterMode, setFilterMode] = useState<FilterMode>(initialFilterMode ?? 'include');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedOptions !== undefined) setSelected(selectedOptions);
  }, [selectedOptions]);

  useEffect(() => {
    if (initialFilterMode !== undefined) setFilterMode(initialFilterMode);
  }, [initialFilterMode]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (isOpen) setTimeout(() => searchRef.current?.focus(), 50);
  }, [isOpen]);

  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const toggleOption = useCallback((val: string) => {
    setSelected(prev => {
      const next = prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val];
      onChange?.(next, filterMode);
      return next;
    });
  }, [onChange, filterMode]);

  const removeTag = useCallback((val: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelected(prev => {
      const next = prev.filter(v => v !== val);
      onChange?.(next, filterMode);
      return next;
    });
  }, [onChange, filterMode]);

  const clearAll = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setSelected([]);
    setFilterMode('include');
    onChange?.([], 'include');
  }, [onChange]);

  const toggleOpen = () => {
    setIsOpen(prev => !prev);
    if (isOpen) setSearch('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { setIsOpen(false); setSearch(''); }
    if (e.key === 'Enter' && !isOpen) setIsOpen(true);
  };

  const handleFilterModeChange = (newFilterMode: FilterMode) => {
    setFilterMode(newFilterMode);
    onChange?.(selected, newFilterMode);
  };

  const selectedLabels = selected.map(v => options.find(o => o.value === v)?.label ?? v);
  const visibleLabels = selectedLabels.slice(0, 1);
  const overflowCount = selectedLabels.length - 1;

  return (
    <InputGroup ref={containerRef} className={`msd-wrapper ${className}`}>
      <div
        id={id}
        role='combobox'
        aria-expanded={isOpen}
        aria-haspopup='listbox'
        tabIndex={0}
        onClick={toggleOpen}
        onKeyDown={handleKeyDown}
        className={`form-control msd-trigger ${isOpen ? 'msd-trigger--open' : ''}`}
      >
        <div className='msd-badges'>
          {selected.length === 0 ? (
            <span className='msd-placeholder'>{placeholder}</span>
          ) : (
            <>
              <AnimatePresence initial={false}>
                {visibleLabels.map((lbl, i) => (
                  <motion.div
                    key={selected[i]}
                    variants={badgeVariants}
                    initial='hidden'
                    animate='visible'
                    exit='exit'
                    layout
                  >
                    <Badge className='msd-badge'>
                      <span className='msd-badge-label'>{lbl}</span>
                      <Button
                        variant='link'
                        onClick={(e) => removeTag(selected[i], e)}
                        aria-label={`Remove ${lbl}`}
                        className='p-0 ps-1 msd-badge-remove'
                      >
                        <CloseSVG showTooltip={true} tooltipText={`Clear ${lbl}`} width='8' height='8' />
                      </Button>
                    </Badge>
                  </motion.div>
                ))}
              </AnimatePresence>
              {overflowCount > 0 && (
                <Badge className='msd-badge msd-badge-overflow'>
                  +{overflowCount}
                </Badge>
              )}
            </>
          )}
        </div>

        <div className='msd-controls'>
          <ChevronSVG className='svg-chevron ms-3 msd-btn-chevron' open={isOpen} />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
            role='listbox'
            aria-multiselectable='true'
            className='msd-dropdown'
          >
            {options.length > 10 && (
              <Form.Control
                ref={searchRef}
                tabIndex={1}
                id='search'
                type='text'
                placeholder='Search'
                aria-label='search'
                aria-describedby='addon-search'
                className='msd-search-input'
                value={search}
                onChange={e => setSearch(e.target.value)}
                onClick={e => e.stopPropagation()}
              />
            )}
            <Form.Group className='p-2 border-bottom d-flex justify-content-center'>
              <Form.Check
                inline
                type='radio'
                id='msd-include'
                name={`msd-mode-${id ?? 'default'}`}
                label='Include'
                className='ms-3 msd-mode-radio'
                checked={filterMode === 'include'}
                onChange={(e) => { e.stopPropagation(); handleFilterModeChange('include'); }}
              />
              <Form.Check
                inline
                type='radio'
                id='msd-exclude'
                name={`msd-mode-${id ?? 'default'}`}
                label='Exclude'
                className='msd-mode-radio'
                checked={filterMode === 'exclude'}
                onChange={(e) => { e.stopPropagation(); handleFilterModeChange('exclude'); }}
              />
            </Form.Group>
            <div className='msd-scroll-container'>
              <PerfectScrollbar>
                <ul className='msd-list list-unstyled'>
                  {filteredOptions.length === 0 ? (
                    <li>
                      <Form.Text className='msd-empty text-muted d-block text-center py-2'>
                        No options found
                      </Form.Text>
                    </li>
                  ) : (
                    filteredOptions.map((opt, i) => {
                      const isSelected = selected.includes(opt.value);
                      return (
                        <motion.li
                          key={opt.value}
                          custom={i}
                          variants={itemVariants}
                          initial='hidden'
                          animate='visible'
                          role='option'
                          aria-selected={isSelected}
                          onClick={() => toggleOption(opt.value)}
                          className={`msd-option ${isSelected ? 'msd-option--selected' : ''}`}
                        >
                          <Form.Check
                            tabIndex={5}
                            onChange={() => { }}
                            checked={isSelected}
                            inline
                            name={opt.value}
                            type='checkbox'
                            id={`msd-option-${opt.value}`}
                            className='msd-option-check'
                            data-testid='select-value-checkbox'
                            label={opt.label}
                            style={{ pointerEvents: 'none' }}
                          />
                        </motion.li>
                      );
                    })
                  )}
                </ul>
              </PerfectScrollbar>
            </div>
            <div className='msd-footer p-2 border-top'>
              <span>{selected.length} selected</span>
              <Button
                disabled={selected.length === 0}
                className='msd-footer-clear'
                variant='link'
                onClick={clearAll}
                aria-label='Clear'
                data-testid='footer-btn-clear-all'
              >
                Clear All
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </InputGroup>
  );
};

export default memo(MultiSelectDropdown);

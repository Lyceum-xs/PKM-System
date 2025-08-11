import React, { useState, useEffect } from 'react';
import { Tag, SelectOption } from '../../types';
import { tagsApi } from '../../api';
import Select from 'react-select';
import { FiX } from 'react-icons/fi';

interface TagSelectorProps {
  type: 'domain' | 'theme';
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  label?: string;
}

const TagSelector: React.FC<TagSelectorProps> = ({
  type,
  selectedTags,
  onChange,
  placeholder,
  label
}) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTags();
  }, [type]);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const data = await tagsApi.getTags(type);
      setTags(data);
    } catch (error) {
      console.error('获取标签失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 将标签按分类分组
  const groupedOptions = tags.reduce((acc, tag) => {
    const category = tag.category || '其他';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push({
      value: tag.name,
      label: tag.name,
      category: tag.category
    });
    return acc;
  }, {} as Record<string, SelectOption[]>);

  // 转换为 react-select 需要的格式
  const options = Object.entries(groupedOptions).map(([category, options]) => ({
    label: category,
    options
  }));

  const selectedOptions = selectedTags.map(tag => ({
    value: tag,
    label: tag
  }));

  const handleChange = (newValue: any) => {
    const newTags = newValue ? newValue.map((option: any) => option.value) : [];
    onChange(newTags);
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = selectedTags.filter(tag => tag !== tagToRemove);
    onChange(newTags);
  };

  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      borderColor: state.isFocused ? '#3b82f6' : '#cbd5e1',
      boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
      '&:hover': {
        borderColor: state.isFocused ? '#3b82f6' : '#94a3b8'
      }
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: type === 'domain' ? '#dbeafe' : '#dcfce7',
      color: type === 'domain' ? '#1e40af' : '#166534'
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: type === 'domain' ? '#1e40af' : '#166534',
      fontSize: '0.75rem'
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: type === 'domain' ? '#1e40af' : '#166534',
      '&:hover': {
        backgroundColor: type === 'domain' ? '#bfdbfe' : '#bbf7d0',
        color: type === 'domain' ? '#1e3a8a' : '#14532d'
      }
    })
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-secondary-700">
          {label}
        </label>
      )}
      
      <Select
        isMulti
        options={options}
        value={selectedOptions}
        onChange={handleChange}
        placeholder={placeholder || `选择${type === 'domain' ? '领域' : '主题'}标签...`}
        isLoading={loading}
        styles={customStyles}
        className="text-sm"
        classNamePrefix="select"
        noOptionsMessage={() => '没有找到标签'}
        loadingMessage={() => '加载中...'}
      />

      {/* 已选择的标签显示 */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedTags.map((tag) => (
            <span
              key={tag}
              className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                type === 'domain'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-green-100 text-green-800'
              }`}
            >
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="hover:bg-black/10 rounded-full p-0.5"
                type="button"
              >
                <FiX className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagSelector;

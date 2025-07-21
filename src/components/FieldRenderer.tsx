import React from 'react';
import { Input, Select, Button, Space } from 'antd';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { Field } from '../App';

const { Option } = Select;

interface FieldRendererProps {
  fieldIndex: number;
  parentPath: string;
}

const FieldRenderer: React.FC<FieldRendererProps> = ({ fieldIndex, parentPath }) => {
  const { control, watch, setValue, register } = useFormContext();
  const fieldPath = `${parentPath}.${fieldIndex}`;
  
  const { fields: parentFields, remove } = useFieldArray({
    control,
    name: parentPath
  });

  // Watch the current field to get its type
  const currentField = watch(fieldPath) as Field;
  const fieldType = currentField?.type;

  // For nested fields
  const { fields: nestedFields, append: appendNested } = useFieldArray({
    control,
    name: `${fieldPath}.children`
  });

  // Generate unique ID for new nested fields
  const generateId = () => `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const addNestedField = () => {
    const newField: Field = {
      id: generateId(),
      name: '',
      type: 'string'
    };
    appendNested(newField);
  };

  const removeField = () => {
    remove(fieldIndex);
  };

  const handleTypeChange = (newType: 'string' | 'number' | 'nested') => {
    setValue(`${fieldPath}.type`, newType, { shouldDirty: true, shouldTouch: true });
    
    // Initialize children array for nested type
    if (newType === 'nested' && !currentField?.children) {
      setValue(`${fieldPath}.children`, [], { shouldDirty: true, shouldTouch: true });
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(`${fieldPath}.name`, e.target.value, { shouldDirty: true, shouldTouch: true });
  };

  return (
    <div className="field-item">
      <div className="field-header">
        <div className="field-controls">
          <Input
            placeholder="Field name"
            value={currentField?.name || ''}
            onChange={handleNameChange}
            style={{ width: 200 }}
          />
          
          <Select
            value={fieldType}
            onChange={handleTypeChange}
            style={{ width: 120 }}
            placeholder="Select type"
          >
            <Option value="string">String</Option>
            <Option value="number">Number</Option>
            <Option value="nested">Nested</Option>
          </Select>
        </div>

        <Space>
          {fieldType === 'nested' && (
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={addNestedField}
              size="small"
            >
              Add Child
            </Button>
          )}
          
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={removeField}
            size="small"
          >
            Delete
          </Button>
        </Space>
      </div>

      {/* Render nested fields if type is 'nested' */}
      {fieldType === 'nested' && nestedFields && nestedFields.length > 0 && (
        <div className="nested-fields">
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {nestedFields.map((nestedField, nestedIndex) => (
              <FieldRenderer
                key={nestedField.id}
                fieldIndex={nestedIndex}
                parentPath={`${fieldPath}.children`}
              />
            ))}
          </Space>
        </div>
      )}

      {/* Show placeholder for empty nested fields */}
      {fieldType === 'nested' && (!nestedFields || nestedFields.length === 0) && (
        <div className="nested-fields">
          <div style={{ 
            textAlign: 'center', 
            color: '#999', 
            padding: '20px',
            border: '1px dashed #d9d9d9',
            borderRadius: '4px',
            fontSize: '12px'
          }}>
            No child fields. Click "Add Child" to add nested fields.
          </div>
        </div>
      )}
    </div>
  );
};

export default FieldRenderer;
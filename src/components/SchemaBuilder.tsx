import React from 'react';
import { Button, Space } from 'antd';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { PlusOutlined } from '@ant-design/icons';
import FieldRenderer from './FieldRenderer';
import type { Field } from '../App';

const SchemaBuilder: React.FC = () => {
  const { control } = useFormContext();
  const { fields, append } = useFieldArray({
    control,
    name: 'fields'
  });

  // Generate unique ID for new fields
  const generateId = () => `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const addField = () => {
    const newField: Field = {
      id: generateId(),
      name: '',
      type: 'string'
    };
    append(newField);
  };

  return (
    <div>
      <div className="add-field-section">
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={addField}
          size="large"
        >
          Add Field
        </Button>
      </div>

      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {fields.map((field, index) => (
          <FieldRenderer
            key={field.id}
            fieldIndex={index}
            parentPath="fields"
          />
        ))}
      </Space>

      {fields.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          color: '#999', 
          padding: '40px',
          border: '2px dashed #d9d9d9',
          borderRadius: '6px'
        }}>
          No fields added yet. Click "Add Field" to get started.
        </div>
      )}
    </div>
  );
};

export default SchemaBuilder;
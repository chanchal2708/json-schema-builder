import React from 'react';
import { Card } from 'antd';
import { useFormContext } from 'react-hook-form';
import type { Field } from '../App';

const JsonPreview: React.FC = () => {
  const { watch } = useFormContext();
  
  // Watch all form values to trigger re-renders
  const formData = watch();
  const fields = formData?.fields as Field[] || [];

  // Convert fields to JSON structure with default values
  const convertFieldsToJson = (fieldsList: Field[]): Record<string, any> => {
    const result: Record<string, any> = {};
    
    if (!Array.isArray(fieldsList)) return result;
    
    fieldsList.forEach(field => {
      if (!field?.name || field.name.trim() === '') return; // Skip fields without names
      
      switch (field.type) {
        case 'string':
          result[field.name] = 'default';
          break;
        case 'number':
          result[field.name] = 0;
          break;
        case 'nested':
          if (field.children && Array.isArray(field.children) && field.children.length > 0) {
            result[field.name] = convertFieldsToJson(field.children);
          } else {
            result[field.name] = {};
          }
          break;
        default:
          result[field.name] = null;
      }
    });
    
    return result;
  };

  const jsonOutput = convertFieldsToJson(fields);
  const formattedJson = JSON.stringify(jsonOutput, null, 2);

  return (
    <Card title="JSON Schema Preview" style={{ height: '100%' }}>
      <div className="json-preview">
        {fields.length === 0 ? (
          <div style={{ color: '#999', fontStyle: 'italic' }}>
            No fields to preview. Add some fields in the Schema Builder tab.
          </div>
        ) : (
          formattedJson
        )}
      </div>
      
      <div style={{ marginTop: '16px', fontSize: '12px', color: '#666' }}>
        <strong>Default Values:</strong>
        <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
          <li>String fields: "default"</li>
          <li>Number fields: 0</li>
          <li>Nested fields: {"{}"} (with recursive content)</li>
        </ul>
        
        <div style={{ marginTop: '8px', fontSize: '10px', color: '#999' }}>
          Fields watched: {fields.length} | Last update: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </Card>
  );
};

export default JsonPreview;
import React from 'react';
import { Tabs } from 'antd';
import { FormProvider, useForm } from 'react-hook-form';
import SchemaBuilder from './components/SchemaBuilder';
import JsonPreview from './components/JsonPreview';
import './App.css';

const { TabPane } = Tabs;

interface FormData {
  fields: Field[];
}

export interface Field {
  id: string;
  name: string;
  type: 'string' | 'number' | 'nested';
  children?: Field[];
}

function App() {
  const methods = useForm<FormData>({
    defaultValues: {
      fields: []
    },
    mode: 'all' // Enable real-time updates for all form interactions
  });

  // Debug: Log form state changes
  const formValues = methods.watch();
  React.useEffect(() => {
    console.log('Form state changed:', formValues);
  }, [formValues]);

  return (
    <div className="app-container">
      <h1>JSON Schema Builder</h1>
      <FormProvider {...methods}>
        <Tabs defaultActiveKey="1" type="card">
          <TabPane tab="Schema Builder" key="1">
            <SchemaBuilder />
          </TabPane>
          <TabPane tab="JSON Preview" key="2">
            <JsonPreview />
          </TabPane>
        </Tabs>
      </FormProvider>
    </div>
  );
}

export default App;
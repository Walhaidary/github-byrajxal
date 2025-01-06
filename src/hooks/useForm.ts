import { useState } from 'react';

interface UseFormProps<T> {
  initialValues: T;
  onSubmit: (values: T) => Promise<void>;
  validate?: (values: T) => Partial<T>;
}

export function useForm<T>({ initialValues, onSubmit, validate }: UseFormProps<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<T>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setValues(prev => {
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        return {
          ...prev,
          [parent]: {
            ...prev[parent as keyof T],
            [child]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
          }
        };
      }
      
      return {
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate) {
      const validationErrors = validate(values);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
    }
    
    setErrors({});
    await onSubmit(values);
  };

  return { 
    values, 
    errors, 
    setValues,  // Add this line to expose setValues
    handleChange, 
    handleSubmit 
  };
}
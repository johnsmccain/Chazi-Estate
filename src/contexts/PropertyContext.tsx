import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Property, Deed } from '../types';

interface PropertyContextType {
  properties: Property[];
  deeds: Deed[];
  addProperty: (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProperty: (id: string, updates: Partial<Property>) => void;
  generateDeed: (propertyId: string) => Promise<Deed>;
  transferProperty: (propertyId: string, newOwnerId: string) => Promise<void>;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const useProperty = () => {
  const context = useContext(PropertyContext);
  if (context === undefined) {
    throw new Error('useProperty must be used within a PropertyProvider');
  }
  return context;
};

interface PropertyProviderProps {
  children: ReactNode;
}

export const PropertyProvider: React.FC<PropertyProviderProps> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [deeds, setDeeds] = useState<Deed[]>([]);

  const addProperty = (propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProperty: Property = {
      ...propertyData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setProperties(prev => [...prev, newProperty]);
  };

  const updateProperty = (id: string, updates: Partial<Property>) => {
    setProperties(prev =>
      prev.map(property =>
        property.id === id
          ? { ...property, ...updates, updatedAt: new Date() }
          : property
      )
    );
  };

  const generateDeed = async (propertyId: string): Promise<Deed> => {
    // Simulate AI deed generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const property = properties.find(p => p.id === propertyId);
    if (!property) throw new Error('Property not found');

    const newDeed: Deed = {
      id: Date.now().toString(),
      propertyId,
      ownerId: property.ownerId,
      createdAt: new Date(),
      status: 'draft',
      terms: `This deed certifies ownership of the property located at ${property.address.street}, ${property.address.city}, ${property.address.state} ${property.address.zipCode}. Valuation: $${property.valuation.toLocaleString()}.`,
      blockchainAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
      videoExplanationUrl: 'https://example.com/tavus-video-explanation',
    };

    setDeeds(prev => [...prev, newDeed]);
    return newDeed;
  };

  const transferProperty = async (propertyId: string, newOwnerId: string) => {
    // Simulate blockchain transfer
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    updateProperty(propertyId, { 
      ownerId: newOwnerId, 
      status: 'transferred',
      blockchainTxId: `0x${Math.random().toString(16).substr(2, 64)}`
    });
  };

  const value = {
    properties,
    deeds,
    addProperty,
    updateProperty,
    generateDeed,
    transferProperty,
  };

  return <PropertyContext.Provider value={value}>{children}</PropertyContext.Provider>;
};
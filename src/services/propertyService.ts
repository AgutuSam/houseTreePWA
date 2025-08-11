import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  onSnapshot,
  DocumentSnapshot,
  QueryConstraint,
  Unsubscribe
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { Property, PropertyFilter } from '../types/property';

export class PropertyService {
  private readonly collection = 'properties';

  async createProperty(property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const propertyData = {
      ...property,
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
      saves: 0,
      inquiries: 0,
      reviewCount: 0
    };

    const docRef = await addDoc(collection(db, this.collection), propertyData);
    return docRef.id;
  }

  async getProperty(id: string): Promise<Property | null> {
    const docRef = doc(db, this.collection, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Property;
    }
    return null;
  }

  async updateProperty(id: string, updates: Partial<Property>): Promise<void> {
    const docRef = doc(db, this.collection, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date()
    });
  }

  async deleteProperty(id: string): Promise<void> {
    const docRef = doc(db, this.collection, id);
    await deleteDoc(docRef);
  }

  async getProperties(
    filters?: PropertyFilter, 
    lastDoc?: DocumentSnapshot, 
    limitCount = 20
  ): Promise<{ properties: Property[], lastDoc: DocumentSnapshot | null }> {
    const constraints: QueryConstraint[] = [];

    if (filters) {
      if (filters.location) {
        constraints.push(where('location.city', '>=', filters.location));
        constraints.push(where('location.city', '<=', filters.location + '\uf8ff'));
      }
      
      if (filters.priceRange) {
        if (filters.priceRange.min) {
          constraints.push(where('price', '>=', filters.priceRange.min));
        }
        if (filters.priceRange.max) {
          constraints.push(where('price', '<=', filters.priceRange.max));
        }
      }

      if (filters.propertyTypes && filters.propertyTypes.length > 0) {
        constraints.push(where('propertyType', 'in', filters.propertyTypes));
      }

      if (filters.bedrooms) {
        constraints.push(where('bedrooms', '>=', filters.bedrooms));
      }

      if (filters.bathrooms) {
        constraints.push(where('bathrooms', '>=', filters.bathrooms));
      }

      if (filters.furnished !== undefined) {
        constraints.push(where('furnished', '==', filters.furnished));
      }

      if (filters.availableFrom) {
        constraints.push(where('availableFrom', '<=', filters.availableFrom));
      }
    }

    // Add ordering
    const sortBy = filters?.sortBy || 'newest';
    switch (sortBy) {
      case 'price_asc':
        constraints.push(orderBy('price', 'asc'));
        break;
      case 'price_desc':
        constraints.push(orderBy('price', 'desc'));
        break;
      case 'oldest':
        constraints.push(orderBy('createdAt', 'asc'));
        break;
      case 'rating':
        constraints.push(orderBy('averageRating', 'desc'));
        break;
      case 'featured':
        constraints.push(orderBy('isFeatured', 'desc'));
        constraints.push(orderBy('createdAt', 'desc'));
        break;
      default: // newest
        constraints.push(orderBy('createdAt', 'desc'));
    }

    constraints.push(limit(limitCount));

    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }

    const q = query(collection(db, this.collection), ...constraints);
    const querySnapshot = await getDocs(q);
    
    const properties: Property[] = [];
    querySnapshot.forEach((doc) => {
      properties.push({ id: doc.id, ...doc.data() } as Property);
    });

    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1] || null;

    return { properties, lastDoc: lastVisible };
  }

  async getPropertiesByOwner(ownerId: string): Promise<Property[]> {
    const q = query(
      collection(db, this.collection),
      where('ownerId', '==', ownerId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const properties: Property[] = [];
    
    querySnapshot.forEach((doc) => {
      properties.push({ id: doc.id, ...doc.data() } as Property);
    });

    return properties;
  }

  async incrementViews(propertyId: string): Promise<void> {
    const property = await this.getProperty(propertyId);
    if (property) {
      await this.updateProperty(propertyId, { views: property.views + 1 });
    }
  }

  async incrementSaves(propertyId: string): Promise<void> {
    const property = await this.getProperty(propertyId);
    if (property) {
      await this.updateProperty(propertyId, { saves: property.saves + 1 });
    }
  }

  async incrementInquiries(propertyId: string): Promise<void> {
    const property = await this.getProperty(propertyId);
    if (property) {
      await this.updateProperty(propertyId, { inquiries: property.inquiries + 1 });
    }
  }

  async uploadPropertyImage(file: File, propertyId: string, index: number): Promise<string> {
    const fileName = `properties/${propertyId}/image_${index}_${Date.now()}`;
    const storageRef = ref(storage, fileName);
    
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  }

  async deletePropertyImage(imageUrl: string): Promise<void> {
    const storageRef = ref(storage, imageUrl);
    await deleteObject(storageRef);
  }

  async searchProperties(searchTerm: string): Promise<Property[]> {
    // This is a basic search implementation
    // For better search, consider using Algolia or similar
    const queries = [
      query(
        collection(db, this.collection),
        where('title', '>=', searchTerm),
        where('title', '<=', searchTerm + '\uf8ff'),
        limit(10)
      ),
      query(
        collection(db, this.collection),
        where('location.city', '>=', searchTerm),
        where('location.city', '<=', searchTerm + '\uf8ff'),
        limit(10)
      )
    ];

    const results = await Promise.all(queries.map(q => getDocs(q)));
    const properties: Property[] = [];
    const seenIds = new Set<string>();

    results.forEach(querySnapshot => {
      querySnapshot.forEach(doc => {
        if (!seenIds.has(doc.id)) {
          seenIds.add(doc.id);
          properties.push({ id: doc.id, ...doc.data() } as Property);
        }
      });
    });

    return properties;
  }

  async getFeaturedProperties(limitCount = 6): Promise<Property[]> {
    const q = query(
      collection(db, this.collection),
      where('isFeatured', '==', true),
      where('isAvailable', '==', true),
      orderBy('featuredUntil', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const properties: Property[] = [];
    
    querySnapshot.forEach((doc) => {
      properties.push({ id: doc.id, ...doc.data() } as Property);
    });

    return properties;
  }

  // Real-time listeners
  subscribeToProperties(
    callback: (properties: Property[]) => void,
    filters?: PropertyFilter,
    limitCount = 20
  ): Unsubscribe {
    const constraints: QueryConstraint[] = [];

    if (filters) {
      if (filters.location) {
        constraints.push(where('location.city', '>=', filters.location));
        constraints.push(where('location.city', '<=', filters.location + '\uf8ff'));
      }
      
      if (filters.priceRange) {
        if (filters.priceRange.min) {
          constraints.push(where('price', '>=', filters.priceRange.min));
        }
        if (filters.priceRange.max) {
          constraints.push(where('price', '<=', filters.priceRange.max));
        }
      }

      if (filters.propertyTypes && filters.propertyTypes.length > 0) {
        constraints.push(where('propertyType', 'in', filters.propertyTypes));
      }

      if (filters.bedrooms) {
        constraints.push(where('bedrooms', '>=', filters.bedrooms));
      }

      if (filters.bathrooms) {
        constraints.push(where('bathrooms', '>=', filters.bathrooms));
      }

      if (filters.furnished !== undefined) {
        constraints.push(where('furnished', '==', filters.furnished));
      }

      if (filters.availableFrom) {
        constraints.push(where('availableFrom', '<=', filters.availableFrom));
      }
    }

    // Add ordering
    const sortBy = filters?.sortBy || 'newest';
    switch (sortBy) {
      case 'price_asc':
        constraints.push(orderBy('price', 'asc'));
        break;
      case 'price_desc':
        constraints.push(orderBy('price', 'desc'));
        break;
      case 'oldest':
        constraints.push(orderBy('createdAt', 'asc'));
        break;
      case 'rating':
        constraints.push(orderBy('averageRating', 'desc'));
        break;
      case 'featured':
        constraints.push(orderBy('isFeatured', 'desc'));
        constraints.push(orderBy('createdAt', 'desc'));
        break;
      default: // newest
        constraints.push(orderBy('createdAt', 'desc'));
    }

    constraints.push(limit(limitCount));

    const q = query(collection(db, this.collection), ...constraints);
    
    return onSnapshot(q, (querySnapshot) => {
      const properties: Property[] = [];
      querySnapshot.forEach((doc) => {
        properties.push({ id: doc.id, ...doc.data() } as Property);
      });
      callback(properties);
    });
  }

  subscribeToProperty(propertyId: string, callback: (property: Property | null) => void): Unsubscribe {
    const docRef = doc(db, this.collection, propertyId);
    
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        callback({ id: docSnap.id, ...docSnap.data() } as Property);
      } else {
        callback(null);
      }
    });
  }

  subscribeToUserProperties(ownerId: string, callback: (properties: Property[]) => void): Unsubscribe {
    const q = query(
      collection(db, this.collection),
      where('ownerId', '==', ownerId),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const properties: Property[] = [];
      querySnapshot.forEach((doc) => {
        properties.push({ id: doc.id, ...doc.data() } as Property);
      });
      callback(properties);
    });
  }

  subscribeToFeaturedProperties(
    callback: (properties: Property[]) => void,
    limitCount = 6
  ): Unsubscribe {
    const q = query(
      collection(db, this.collection),
      where('isFeatured', '==', true),
      where('isAvailable', '==', true),
      orderBy('featuredUntil', 'desc'),
      limit(limitCount)
    );

    return onSnapshot(q, (querySnapshot) => {
      const properties: Property[] = [];
      querySnapshot.forEach((doc) => {
        properties.push({ id: doc.id, ...doc.data() } as Property);
      });
      callback(properties);
    });
  }
}

export const propertyService = new PropertyService();

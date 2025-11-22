// hooks/useIoTKitVerification.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = "https://mycomatrix.in/api";

// Define IoT controller product IDs based on your database
const IOT_CONTROLLER_PRODUCT_IDS = [4, 5, 6]; // IOT CONTROLLER products

export const useIoTKitVerification = (token) => {
  const [hasIoTKit, setHasIoTKit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userOrders, setUserOrders] = useState([]);

  const checkIoTKitPurchase = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      console.log('🎯 Checking for IoT Controller Product IDs:', IOT_CONTROLLER_PRODUCT_IDS);

      const response = await axios.get(`${API_BASE_URL}/orders/my-orders/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📦 Orders API Response:', response.data);

      // ✅ FIXED: Handle array response directly
      let orders = [];
      
      if (Array.isArray(response.data)) {
        orders = response.data;
      } else if (response.data.orders && Array.isArray(response.data.orders)) {
        orders = response.data.orders;
      } else if (response.data.success && response.data.orders) {
        orders = response.data.orders;
      } else {
        orders = [];
      }

      setUserOrders(orders);
      
      // ✅ FIXED: Check for IoT controller products in the CORRECT structure
      const hasPurchasedIoTKit = orders.some(order => {
        // Only check COMPLETED and PAID orders
        if (order.status !== 'completed' || order.payment_status !== 'paid') {
          return false;
        }

        // Check items array (this is the correct structure from your API)
        if (order.items && Array.isArray(order.items)) {
          const hasIoTProduct = order.items.some(item => {
            const productId = item.product?.id;
            console.log(`🔍 Checking item:`, { 
              productId, 
              productName: item.product?.name,
              isIoT: IOT_CONTROLLER_PRODUCT_IDS.includes(productId)
            });
            return IOT_CONTROLLER_PRODUCT_IDS.includes(productId);
          });
          
          if (hasIoTProduct) {
            console.log(`✅ Found IoT product in order ${order.id}`);
          }
          return hasIoTProduct;
        }
        
        return false;
      });
      
      console.log('🔍 IoT Controller Purchase Status:', hasPurchasedIoTKit);
      console.log('📊 Processed Orders:', orders);
      setHasIoTKit(hasPurchasedIoTKit);
      
      // Debug: Log which IoT products were found
      if (hasPurchasedIoTKit) {
        orders.forEach(order => {
          if (order.items && Array.isArray(order.items)) {
            order.items.forEach(item => {
              const productId = item.product?.id;
              if (IOT_CONTROLLER_PRODUCT_IDS.includes(productId)) {
                console.log(`✅ Found IoT Controller Purchase:`, {
                  orderId: order.id,
                  productId: productId,
                  productName: item.product?.name,
                  status: order.status,
                  payment_status: order.payment_status
                });
              }
            });
          }
        });
      } else {
        console.log('❌ No IoT Controller purchases found in orders');
        console.log('🔍 Checking order structures:');
        orders.forEach(order => {
          console.log(`Order ${order.id}:`, {
            status: order.status,
            payment_status: order.payment_status,
            items: order.items?.map(item => ({
              productId: item.product?.id,
              productName: item.product?.name
            }))
          });
        });
      }
    } catch (error) {
      console.error('❌ Error checking IoT kit purchase:', error);
      setError('Failed to verify IoT kit purchase: ' + (error.response?.data?.message || error.message));
      setHasIoTKit(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkIoTKitPurchase();
  }, [token]);

  return { 
    hasIoTKit, 
    loading, 
    error, 
    userOrders,
    iotProductIds: IOT_CONTROLLER_PRODUCT_IDS,
    refetch: checkIoTKitPurchase 
  };
};
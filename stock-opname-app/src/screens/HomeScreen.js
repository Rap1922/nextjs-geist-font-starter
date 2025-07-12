import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  RefreshControl,
  StatusBar,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import DatabaseService from '../services/DatabaseService';

const HomeScreen = ({navigation}) => {
  const [stockItems, setStockItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadStockItems();
    }, [])
  );

  const loadStockItems = async () => {
    try {
      setLoading(true);
      const items = await DatabaseService.getAllStockItems();
      setStockItems(items);
      setFilteredItems(items);
    } catch (error) {
      console.error('Error loading stock items:', error);
      Alert.alert('Error', 'Gagal memuat data barang');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStockItems();
    setRefreshing(false);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredItems(stockItems);
    } else {
      const filtered = stockItems.filter(item =>
        item.item_name.toLowerCase().includes(query.toLowerCase()) ||
        item.item_code.toLowerCase().includes(query.toLowerCase()) ||
        (item.category && item.category.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredItems(filtered);
    }
  };

  const handleDeleteItem = (item) => {
    Alert.alert(
      'Konfirmasi Hapus',
      `Apakah Anda yakin ingin menghapus "${item.item_name}"?`,
      [
        {text: 'Batal', style: 'cancel'},
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await DatabaseService.deleteStockItem(item.id);
              loadStockItems();
              Alert.alert('Sukses', 'Barang berhasil dihapus');
            } catch (error) {
              console.error('Error deleting item:', error);
              Alert.alert('Error', 'Gagal menghapus barang');
            }
          },
        },
      ]
    );
  };

  const renderStockItem = ({item}) => {
    const isLowStock = item.stock_quantity <= item.min_stock;
    
    return (
      <TouchableOpacity
        style={[styles.itemContainer, isLowStock && styles.lowStockItem]}
        onPress={() => navigation.navigate('EditItem', {item})}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemName}>{item.item_name}</Text>
          <Text style={styles.itemCode}>{item.item_code}</Text>
        </View>
        
        <View style={styles.itemDetails}>
          <Text style={styles.itemCategory}>
            Kategori: {item.category || 'Tidak ada'}
          </Text>
          <Text style={styles.itemLocation}>
            Lokasi: {item.location || 'Tidak ada'}
          </Text>
        </View>

        <View style={styles.itemFooter}>
          <View style={styles.stockInfo}>
            <Text style={[styles.stockQuantity, isLowStock && styles.lowStockText]}>
              Stok: {item.stock_quantity} {item.unit}
            </Text>
            <Text style={styles.minStock}>
              Min: {item.min_stock} {item.unit}
            </Text>
          </View>
          
          <View style={styles.priceInfo}>
            <Text style={styles.price}>
              Rp {item.price ? item.price.toLocaleString('id-ID') : '0'}
            </Text>
          </View>
        </View>

        {isLowStock && (
          <View style={styles.lowStockWarning}>
            <Text style={styles.lowStockWarningText}>⚠️ Stok Rendah</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteItem(item)}>
          <Text style={styles.deleteButtonText}>🗑️</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Belum ada data barang</Text>
      <Text style={styles.emptySubText}>
        Tap tombol + untuk menambah barang baru
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1976D2" barStyle="light-content" />
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari barang..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Stock Items List */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderStockItem}
        ListEmptyComponent={renderEmptyList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={filteredItems.length === 0 ? styles.emptyListContainer : null}
      />

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={styles.exportButton}
          onPress={() => navigation.navigate('Export')}>
          <Text style={styles.actionButtonText}>📊 Export</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddItem')}>
          <Text style={styles.actionButtonText}>+ Tambah</Text>
        </TouchableOpacity>
      </View>

      {/* Summary */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>
          Total: {filteredItems.length} barang
        </Text>
        <Text style={styles.summaryText}>
          Stok Rendah: {filteredItems.filter(item => item.stock_quantity <= item.min_stock).length}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  itemContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    position: 'relative',
  },
  lowStockItem: {
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  itemCode: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  itemDetails: {
    marginBottom: 8,
  },
  itemCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  itemLocation: {
    fontSize: 14,
    color: '#666',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stockInfo: {
    flex: 1,
  },
  stockQuantity: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  lowStockText: {
    color: '#f44336',
  },
  minStock: {
    fontSize: 12,
    color: '#999',
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  lowStockWarning: {
    marginTop: 8,
    padding: 4,
    backgroundColor: '#fff3cd',
    borderRadius: 4,
  },
  lowStockWarningText: {
    fontSize: 12,
    color: '#856404',
    textAlign: 'center',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 8,
  },
  deleteButtonText: {
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyListContainer: {
    flex: 1,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  addButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  exportButton: {
    flex: 1,
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  summaryText: {
    fontSize: 12,
    color: '#666',
  },
});

export default HomeScreen;

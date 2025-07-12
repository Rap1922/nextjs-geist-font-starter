import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  StatusBar,
} from 'react-native';
import DatabaseService from '../services/DatabaseService';

const EditItemScreen = ({navigation, route}) => {
  const {item} = route.params;
  const [editedItem, setEditedItem] = useState({
    ...item,
    stock_quantity: item.stock_quantity?.toString() || '0',
    min_stock: item.min_stock?.toString() || '0',
    price: item.price?.toString() || '0',
  });

  const handleInputChange = (field, value) => {
    setEditedItem({...editedItem, [field]: value});
  };

  const handleUpdate = async () => {
    // Basic validation
    if (!editedItem.item_code.trim() || !editedItem.item_name.trim()) {
      Alert.alert(
        'Validation Error',
        'Kode Barang dan Nama Barang harus diisi.'
      );
      return;
    }

    try {
      await DatabaseService.updateStockItem(editedItem.id, {
        ...editedItem,
        stock_quantity: parseInt(editedItem.stock_quantity, 10) || 0,
        min_stock: parseInt(editedItem.min_stock, 10) || 0,
        price: parseFloat(editedItem.price) || 0,
      });
      Alert.alert('Sukses', 'Barang berhasil diupdate');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating item:', error);
      Alert.alert('Error', 'Gagal mengupdate data barang');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar backgroundColor="#F57C00" barStyle="light-content" />
      
      <Text style={styles.title}>Edit Barang</Text>
      
      <Text style={styles.label}>Kode Barang *</Text>
      <TextInput
        style={styles.input}
        placeholder="Masukkan kode barang"
        value={editedItem.item_code}
        onChangeText={text => handleInputChange('item_code', text)}
      />

      <Text style={styles.label}>Nama Barang *</Text>
      <TextInput
        style={styles.input}
        placeholder="Masukkan nama barang"
        value={editedItem.item_name}
        onChangeText={text => handleInputChange('item_name', text)}
      />

      <Text style={styles.label}>Kategori</Text>
      <TextInput
        style={styles.input}
        placeholder="Masukkan kategori"
        value={editedItem.category || ''}
        onChangeText={text => handleInputChange('category', text)}
      />

      <Text style={styles.label}>Satuan</Text>
      <TextInput
        style={styles.input}
        placeholder="Masukkan satuan"
        value={editedItem.unit || 'pcs'}
        onChangeText={text => handleInputChange('unit', text)}
      />

      <Text style={styles.label}>Stok</Text>
      <TextInput
        style={styles.input}
        placeholder="Masukkan jumlah stok"
        value={editedItem.stock_quantity}
        keyboardType="numeric"
        onChangeText={text => handleInputChange('stock_quantity', text)}
      />

      <Text style={styles.label}>Stok Minimum</Text>
      <TextInput
        style={styles.input}
        placeholder="Masukkan stok minimum"
        keyboardType="numeric"
        value={editedItem.min_stock}
        onChangeText={text => handleInputChange('min_stock', text)}
      />

      <Text style={styles.label}>Harga (Rp)</Text>
      <TextInput
        style={styles.input}
        placeholder="Masukkan harga"
        keyboardType="numeric"
        value={editedItem.price}
        onChangeText={text => handleInputChange('price', text)}
      />

      <Text style={styles.label}>Lokasi</Text>
      <TextInput
        style={styles.input}
        placeholder="Masukkan lokasi barang"
        value={editedItem.location || ''}
        onChangeText={text => handleInputChange('location', text)}
      />

      <Text style={styles.label}>Catatan</Text>
      <TextInput
        style={[styles.input, styles.notesInput]}
        placeholder="Tambahkan catatan (opsional)"
        multiline
        numberOfLines={3}
        value={editedItem.notes || ''}
        onChangeText={text => handleInputChange('notes', text)}
      />

      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.updateButtonText}>Update Barang</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#555',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    elevation: 1,
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  updateButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    elevation: 2,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EditItemScreen;

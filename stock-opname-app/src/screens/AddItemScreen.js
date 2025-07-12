import React, {useState} from 'react';
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

const AddItemScreen = ({navigation}) => {
  const [item, setItem] = useState({
    item_code: '',
    item_name: '',
    category: '',
    unit: 'pcs',
    stock_quantity: '',
    min_stock: '',
    price: '',
    location: '',
    notes: '',
  });

  const handleInputChange = (field, value) => {
    setItem({...item, [field]: value});
  };

  const handleSave = async () => {
    // Basic validation
    if (!item.item_code.trim() || !item.item_name.trim()) {
      Alert.alert(
        'Validation Error',
        'Kode Barang dan Nama Barang harus diisi.'
      );
      return;
    }

    try {
      await DatabaseService.addStockItem({
        ...item,
        stock_quantity: parseInt(item.stock_quantity, 10) || 0,
        min_stock: parseInt(item.min_stock, 10) || 0,
        price: parseFloat(item.price) || 0,
      });
      Alert.alert('Sukses', 'Barang berhasil ditambahkan');
      navigation.goBack();
    } catch (error) {
      console.error('Error saving item:', error);
      Alert.alert('Error', 'Gagal menyimpan data barang');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar backgroundColor="#388E3C" barStyle="light-content" />
      
      <Text style={styles.title}>Tambah Barang Baru</Text>
      
      <Text style={styles.label}>Kode Barang *</Text>
      <TextInput
        style={styles.input}
        placeholder="Masukkan kode barang"
        value={item.item_code}
        onChangeText={text => handleInputChange('item_code', text)}
      />

      <Text style={styles.label}>Nama Barang *</Text>
      <TextInput
        style={styles.input}
        placeholder="Masukkan nama barang"
        value={item.item_name}
        onChangeText={text => handleInputChange('item_name', text)}
      />

      <Text style={styles.label}>Kategori</Text>
      <TextInput
        style={styles.input}
        placeholder="Masukkan kategori"
        value={item.category}
        onChangeText={text => handleInputChange('category', text)}
      />

      <Text style={styles.label}>Satuan</Text>
      <TextInput
        style={styles.input}
        placeholder="Masukkan satuan (default: pcs)"
        value={item.unit}
        onChangeText={text => handleInputChange('unit', text)}
      />

      <Text style={styles.label}>Stok</Text>
      <TextInput
        style={styles.input}
        placeholder="Masukkan jumlah stok"
        value={item.stock_quantity}
        keyboardType="numeric"
        onChangeText={text => handleInputChange('stock_quantity', text)}
      />

      <Text style={styles.label}>Stok Minimum</Text>
      <TextInput
        style={styles.input}
        placeholder="Masukkan stok minimum"
        keyboardType="numeric"
        value={item.min_stock}
        onChangeText={text => handleInputChange('min_stock', text)}
      />

      <Text style={styles.label}>Harga (Rp)</Text>
      <TextInput
        style={styles.input}
        placeholder="Masukkan harga"
        keyboardType="numeric"
        value={item.price}
        onChangeText={text => handleInputChange('price', text)}
      />

      <Text style={styles.label}>Lokasi</Text>
      <TextInput
        style={styles.input}
        placeholder="Masukkan lokasi barang"
        value={item.location}
        onChangeText={text => handleInputChange('location', text)}
      />

      <Text style={styles.label}>Catatan</Text>
      <TextInput
        style={[styles.input, styles.notesInput]}
        placeholder="Tambahkan catatan (opsional)"
        multiline
        numberOfLines={3}
        value={item.notes}
        onChangeText={text => handleInputChange('notes', text)}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Simpan Barang</Text>
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
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    elevation: 2,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddItemScreen;

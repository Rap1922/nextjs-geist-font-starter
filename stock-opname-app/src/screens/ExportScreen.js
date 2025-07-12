import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import CSVExportService from '../services/CSVExportService';

const ExportScreen = () => {
  const [exportResult, setExportResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exportedFiles, setExportedFiles] = useState([]);

  useEffect(() => {
    loadExportedFiles();
  }, []);

  const loadExportedFiles = async () => {
    try {
      const files = await CSVExportService.getExportedFiles();
      setExportedFiles(files);
    } catch (error) {
      console.error('Error loading exported files:', error);
    }
  };

  const handleExport = async () => {
    setLoading(true);
    try {
      const result = await CSVExportService.exportAndShare();
      
      if (result.success) {
        Alert.alert(
          'Sukses',
          `Berhasil mengekspor ${result.recordCount} data ke CSV`
        );
        setExportResult(result);
        loadExportedFiles(); // Refresh the file list
      } else {
        Alert.alert('Error', result.error || 'Gagal mengekspor data');
      }
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat mengekspor data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFile = async (filePath, fileName) => {
    Alert.alert(
      'Konfirmasi Hapus',
      `Apakah Anda yakin ingin menghapus file "${fileName}"?`,
      [
        {text: 'Batal', style: 'cancel'},
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await CSVExportService.deleteExportedFile(filePath);
              if (result.success) {
                Alert.alert('Sukses', 'File berhasil dihapus');
                loadExportedFiles();
              } else {
                Alert.alert('Error', 'Gagal menghapus file');
              }
            } catch (error) {
              console.error('Error deleting file:', error);
              Alert.alert('Error', 'Terjadi kesalahan saat menghapus file');
            }
          },
        },
      ]
    );
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID') + ' ' + date.toLocaleTimeString('id-ID');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar backgroundColor="#7B1FA2" barStyle="light-content" />
      
      <Text style={styles.title}>Export Data Stok Opname</Text>
      
      <View style={styles.instructionContainer}>
        <Text style={styles.instruction}>
          Tekan tombol di bawah untuk mengekspor semua data stok menjadi file CSV dan membagikannya.
        </Text>
      </View>

      <TouchableOpacity 
        style={[styles.exportButton, loading && styles.disabledButton]} 
        onPress={handleExport}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.exportButtonText}>📊 Export & Share CSV</Text>
        )}
      </TouchableOpacity>

      {exportResult && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Export Terakhir:</Text>
          <Text style={styles.resultText}>File: {exportResult.fileName}</Text>
          <Text style={styles.resultText}>Jumlah Data: {exportResult.recordCount}</Text>
        </View>
      )}

      {exportedFiles.length > 0 && (
        <View style={styles.filesContainer}>
          <Text style={styles.filesTitle}>File CSV yang Tersimpan:</Text>
          {exportedFiles.map((file, index) => (
            <View key={index} style={styles.fileItem}>
              <View style={styles.fileInfo}>
                <Text style={styles.fileName}>{file.name}</Text>
                <Text style={styles.fileDetails}>
                  {formatFileSize(file.size)} • {formatDate(file.mtime)}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.deleteFileButton}
                onPress={() => handleDeleteFile(file.path, file.name)}
              >
                <Text style={styles.deleteFileButtonText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Informasi:</Text>
        <Text style={styles.infoText}>
          • File CSV akan disimpan di penyimpanan internal aplikasi
        </Text>
        <Text style={styles.infoText}>
          • Anda dapat membagikan file melalui aplikasi lain
        </Text>
        <Text style={styles.infoText}>
          • File lama dapat dihapus untuk menghemat ruang penyimpanan
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  instructionContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    elevation: 1,
  },
  instruction: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    lineHeight: 24,
  },
  exportButton: {
    backgroundColor: '#7B1FA2',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  exportButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContainer: {
    backgroundColor: '#E8F5E8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  resultText: {
    fontSize: 14,
    color: '#2E7D32',
    marginBottom: 4,
  },
  filesContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    elevation: 1,
  },
  filesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  fileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  fileDetails: {
    fontSize: 12,
    color: '#666',
  },
  deleteFileButton: {
    padding: 8,
  },
  deleteFileButtonText: {
    fontSize: 16,
  },
  infoContainer: {
    backgroundColor: '#FFF3E0',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#E65100',
    marginBottom: 4,
    lineHeight: 20,
  },
});

export default ExportScreen;

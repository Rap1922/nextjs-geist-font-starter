import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import DatabaseService from './DatabaseService';

class CSVExportService {
  
  convertToCSV(data) {
    if (!data || data.length === 0) {
      return '';
    }

    // CSV Headers
    const headers = [
      'ID',
      'Kode Barang',
      'Nama Barang', 
      'Kategori',
      'Satuan',
      'Stok',
      'Stok Minimum',
      'Harga',
      'Lokasi',
      'Terakhir Update',
      'Catatan'
    ];

    // Convert data to CSV format
    const csvRows = [];
    csvRows.push(headers.join(','));

    data.forEach(item => {
      const row = [
        item.id || '',
        `"${(item.item_code || '').replace(/"/g, '""')}"`,
        `"${(item.item_name || '').replace(/"/g, '""')}"`,
        `"${(item.category || '').replace(/"/g, '""')}"`,
        `"${(item.unit || '').replace(/"/g, '""')}"`,
        item.stock_quantity || 0,
        item.min_stock || 0,
        item.price || 0,
        `"${(item.location || '').replace(/"/g, '""')}"`,
        `"${(item.last_updated || '').replace(/"/g, '""')}"`,
        `"${(item.notes || '').replace(/"/g, '""')}"`,
      ];
      csvRows.push(row.join(','));
    });

    return csvRows.join('\n');
  }

  async exportToCSV() {
    try {
      // Get all stock items from database
      const stockItems = await DatabaseService.getAllStockItems();
      
      if (stockItems.length === 0) {
        throw new Error('Tidak ada data untuk diekspor');
      }

      // Convert to CSV
      const csvContent = this.convertToCSV(stockItems);
      
      // Generate filename with current date
      const currentDate = new Date();
      const dateString = currentDate.toISOString().split('T')[0];
      const timeString = currentDate.toTimeString().split(' ')[0].replace(/:/g, '-');
      const fileName = `stock_opname_${dateString}_${timeString}.csv`;
      
      // Define file path
      const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      
      // Write CSV content to file
      await RNFS.writeFile(filePath, csvContent, 'utf8');
      
      console.log('CSV file created successfully:', filePath);
      
      return {
        success: true,
        filePath: filePath,
        fileName: fileName,
        recordCount: stockItems.length
      };
      
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async shareCSVFile(filePath, fileName) {
    try {
      const shareOptions = {
        title: 'Export Data Stok Opname',
        message: `File CSV berisi ${fileName}`,
        url: `file://${filePath}`,
        type: 'text/csv',
        filename: fileName,
        saveToFiles: true,
      };

      const result = await Share.open(shareOptions);
      console.log('File shared successfully:', result);
      return { success: true, result };
      
    } catch (error) {
      console.error('Error sharing file:', error);
      return { success: false, error: error.message };
    }
  }

  async exportAndShare() {
    try {
      // Export to CSV
      const exportResult = await this.exportToCSV();
      
      if (!exportResult.success) {
        return exportResult;
      }

      // Share the file
      const shareResult = await this.shareCSVFile(
        exportResult.filePath, 
        exportResult.fileName
      );

      return {
        success: shareResult.success,
        message: shareResult.success 
          ? `Berhasil mengekspor ${exportResult.recordCount} data ke CSV`
          : shareResult.error,
        filePath: exportResult.filePath,
        fileName: exportResult.fileName,
        recordCount: exportResult.recordCount
      };

    } catch (error) {
      console.error('Error in exportAndShare:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getExportedFiles() {
    try {
      const files = await RNFS.readDir(RNFS.DocumentDirectoryPath);
      const csvFiles = files.filter(file => 
        file.name.startsWith('stock_opname_') && file.name.endsWith('.csv')
      );
      
      return csvFiles.map(file => ({
        name: file.name,
        path: file.path,
        size: file.size,
        mtime: file.mtime
      }));
      
    } catch (error) {
      console.error('Error getting exported files:', error);
      return [];
    }
  }

  async deleteExportedFile(filePath) {
    try {
      await RNFS.unlink(filePath);
      console.log('File deleted successfully:', filePath);
      return { success: true };
    } catch (error) {
      console.error('Error deleting file:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new CSVExportService();

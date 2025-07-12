import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

class DatabaseService {
  constructor() {
    this.database = null;
  }

  async initDB() {
    try {
      this.database = await SQLite.openDatabase({
        name: 'StockOpname.db',
        location: 'default',
      });
      
      await this.createTables();
      console.log('Database initialized successfully');
      return this.database;
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  async createTables() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS stock_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_code TEXT NOT NULL UNIQUE,
        item_name TEXT NOT NULL,
        category TEXT,
        unit TEXT,
        stock_quantity INTEGER DEFAULT 0,
        min_stock INTEGER DEFAULT 0,
        price REAL DEFAULT 0,
        location TEXT,
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
        notes TEXT
      );
    `;

    try {
      await this.database.executeSql(createTableQuery);
      console.log('Tables created successfully');
    } catch (error) {
      console.error('Error creating tables:', error);
      throw error;
    }
  }

  async addStockItem(item) {
    const insertQuery = `
      INSERT INTO stock_items (
        item_code, item_name, category, unit, stock_quantity, 
        min_stock, price, location, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    try {
      const result = await this.database.executeSql(insertQuery, [
        item.item_code,
        item.item_name,
        item.category || '',
        item.unit || 'pcs',
        item.stock_quantity || 0,
        item.min_stock || 0,
        item.price || 0,
        item.location || '',
        item.notes || ''
      ]);
      
      console.log('Item added successfully');
      return result;
    } catch (error) {
      console.error('Error adding item:', error);
      throw error;
    }
  }

  async getAllStockItems() {
    const selectQuery = 'SELECT * FROM stock_items ORDER BY item_name ASC;';
    
    try {
      const results = await this.database.executeSql(selectQuery);
      const items = [];
      
      for (let i = 0; i < results[0].rows.length; i++) {
        items.push(results[0].rows.item(i));
      }
      
      return items;
    } catch (error) {
      console.error('Error fetching items:', error);
      throw error;
    }
  }

  async updateStockItem(id, item) {
    const updateQuery = `
      UPDATE stock_items 
      SET item_code = ?, item_name = ?, category = ?, unit = ?, 
          stock_quantity = ?, min_stock = ?, price = ?, location = ?, 
          notes = ?, last_updated = CURRENT_TIMESTAMP
      WHERE id = ?;
    `;

    try {
      const result = await this.database.executeSql(updateQuery, [
        item.item_code,
        item.item_name,
        item.category || '',
        item.unit || 'pcs',
        item.stock_quantity || 0,
        item.min_stock || 0,
        item.price || 0,
        item.location || '',
        item.notes || '',
        id
      ]);
      
      console.log('Item updated successfully');
      return result;
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  }

  async deleteStockItem(id) {
    const deleteQuery = 'DELETE FROM stock_items WHERE id = ?;';
    
    try {
      const result = await this.database.executeSql(deleteQuery, [id]);
      console.log('Item deleted successfully');
      return result;
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  }

  async searchStockItems(searchTerm) {
    const searchQuery = `
      SELECT * FROM stock_items 
      WHERE item_name LIKE ? OR item_code LIKE ? OR category LIKE ?
      ORDER BY item_name ASC;
    `;
    
    try {
      const searchPattern = `%${searchTerm}%`;
      const results = await this.database.executeSql(searchQuery, [
        searchPattern, searchPattern, searchPattern
      ]);
      
      const items = [];
      for (let i = 0; i < results[0].rows.length; i++) {
        items.push(results[0].rows.item(i));
      }
      
      return items;
    } catch (error) {
      console.error('Error searching items:', error);
      throw error;
    }
  }

  async closeDatabase() {
    if (this.database) {
      try {
        await this.database.close();
        console.log('Database closed successfully');
      } catch (error) {
        console.error('Error closing database:', error);
      }
    }
  }
}

export default new DatabaseService();

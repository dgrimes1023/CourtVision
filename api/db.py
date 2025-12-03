"""
CourtVision Database Connection Module
Checkpoint 2: PostgreSQL Connection Helper
Author: CS3620 Student
Date: December 2, 2025
"""

import psycopg2
from psycopg2 import pool
from psycopg2.extras import RealDictCursor
import os
from typing import List, Dict, Any, Optional

class Database:
    """Database connection and query execution helper class"""
    
    def __init__(self):
        """Initialize database connection pool"""
        self.connection_pool = None
        db_password = os.getenv('DB_PASSWORD', 'postgres')
        self.db_config = {
            'host': os.getenv('DB_HOST', 'localhost'),
            'port': os.getenv('DB_PORT', '5432'),
            'database': os.getenv('DB_NAME', 'courtvision'),
            'user': os.getenv('DB_USER', 'postgres')
        }
        # Only add password if it's not empty
        if db_password:
            self.db_config['password'] = db_password
    
    def create_pool(self, minconn=1, maxconn=10):
        """Create connection pool"""
        try:
            self.connection_pool = psycopg2.pool.SimpleConnectionPool(
                minconn,
                maxconn,
                **self.db_config
            )
            if self.connection_pool:
                print("✓ Database connection pool created successfully")
        except (Exception, psycopg2.DatabaseError) as error:
            print(f"✗ Error creating connection pool: {error}")
            raise
    
    def get_connection(self):
        """Get a connection from the pool"""
        if self.connection_pool:
            return self.connection_pool.getconn()
        return None
    
    def return_connection(self, connection):
        """Return a connection to the pool"""
        if self.connection_pool:
            self.connection_pool.putconn(connection)
    
    def close_pool(self):
        """Close all connections in the pool"""
        if self.connection_pool:
            self.connection_pool.closeall()
            print("✓ Database connection pool closed")
    
    def execute_query(self, query: str, params: tuple = None) -> List[Dict[str, Any]]:
        """
        Execute a SELECT query and return results as list of dictionaries
        
        Args:
            query: SQL query string
            params: Query parameters tuple
            
        Returns:
            List of dictionaries containing query results
        """
        connection = None
        try:
            connection = self.get_connection()
            cursor = connection.cursor(cursor_factory=RealDictCursor)
            cursor.execute(query, params)
            results = cursor.fetchall()
            cursor.close()
            
            # Convert RealDictRow to regular dict
            return [dict(row) for row in results]
        
        except (Exception, psycopg2.DatabaseError) as error:
            print(f"✗ Error executing query: {error}")
            raise
        
        finally:
            if connection:
                self.return_connection(connection)
    
    def execute_write(self, query: str, params: tuple = None) -> int:
        """
        Execute an INSERT, UPDATE, or DELETE query
        
        Args:
            query: SQL query string
            params: Query parameters tuple
            
        Returns:
            Number of rows affected
        """
        connection = None
        try:
            connection = self.get_connection()
            cursor = connection.cursor()
            cursor.execute(query, params)
            rows_affected = cursor.rowcount
            connection.commit()
            cursor.close()
            return rows_affected
        
        except (Exception, psycopg2.DatabaseError) as error:
            if connection:
                connection.rollback()
            print(f"✗ Error executing write: {error}")
            raise
        
        finally:
            if connection:
                self.return_connection(connection)
    
    def execute_function(self, function_name: str, params: tuple = None) -> Any:
        """
        Execute a PostgreSQL function and return the result
        
        Args:
            function_name: Name of the function to call
            params: Function parameters tuple
            
        Returns:
            Function result
        """
        connection = None
        try:
            connection = self.get_connection()
            cursor = connection.cursor(cursor_factory=RealDictCursor)
            
            # Build function call with proper number of placeholders
            if params:
                placeholders = ', '.join(['%s'] * len(params))
                query = f"SELECT * FROM {function_name}({placeholders})"
            else:
                query = f"SELECT * FROM {function_name}()"
            
            cursor.execute(query, params)
            results = cursor.fetchall()
            connection.commit()
            cursor.close()
            
            # Convert RealDictRow to regular dict
            return [dict(row) for row in results]
        
        except (Exception, psycopg2.DatabaseError) as error:
            if connection:
                connection.rollback()
            print(f"✗ Error executing function: {error}")
            raise
        
        finally:
            if connection:
                self.return_connection(connection)
    
    def execute_function_scalar(self, function_name: str, params: tuple = None) -> Any:
        """
        Execute a PostgreSQL function that returns a single scalar value
        
        Args:
            function_name: Name of the function to call
            params: Function parameters tuple
            
        Returns:
            Single scalar value
        """
        connection = None
        try:
            connection = self.get_connection()
            cursor = connection.cursor()
            
            # Build function call with proper number of placeholders
            if params:
                placeholders = ', '.join(['%s'] * len(params))
                query = f"SELECT {function_name}({placeholders})"
            else:
                query = f"SELECT {function_name}()"
            
            cursor.execute(query, params)
            result = cursor.fetchone()
            connection.commit()
            cursor.close()
            
            return result[0] if result else None
        
        except (Exception, psycopg2.DatabaseError) as error:
            if connection:
                connection.rollback()
            print(f"✗ Error executing scalar function: {error}")
            raise
        
        finally:
            if connection:
                self.return_connection(connection)
    
    def test_connection(self) -> bool:
        """Test database connection"""
        connection = None
        try:
            connection = self.get_connection()
            cursor = connection.cursor()
            cursor.execute("SELECT version();")
            db_version = cursor.fetchone()
            cursor.close()
            print(f"✓ Connected to: {db_version[0]}")
            return True
        
        except (Exception, psycopg2.DatabaseError) as error:
            print(f"✗ Connection test failed: {error}")
            return False
        
        finally:
            if connection:
                self.return_connection(connection)


# Singleton database instance
db = Database()

# Initialize connection pool on module import
try:
    db.create_pool()
except Exception as e:
    print(f"Warning: Could not initialize database pool: {e}")

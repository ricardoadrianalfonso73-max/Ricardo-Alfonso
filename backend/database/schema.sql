-- ==========================================================
-- ELECTRO TECNO — Esquema de Base de Datos MySQL 8.0+
-- ==========================================================

CREATE DATABASE IF NOT EXISTS electro_tecno
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE electro_tecno;

-- Usuarios y clientes
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(40) NULL,
  role ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Catálogo de productos
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(36) PRIMARY KEY,
  slug VARCHAR(140) NOT NULL UNIQUE,
  name VARCHAR(180) NOT NULL,
  category ENUM('celulares', 'teclados', 'mouse', 'monitores', 'auriculares', 'cargadores', 'accesorios') NOT NULL,
  product_condition ENUM('Nuevo', 'Usado') NOT NULL,
  price INT NOT NULL,
  previous_price INT NULL,
  discount_percent INT NULL,
  description TEXT NOT NULL,
  specs JSON NOT NULL,
  warranty VARCHAR(120) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  image_url VARCHAR(255) NOT NULL,
  is_featured BOOLEAN NOT NULL DEFAULT TRUE,
  is_offer BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Órdenes de compra
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(36) PRIMARY KEY,
  order_code VARCHAR(24) NOT NULL UNIQUE,
  user_id VARCHAR(36) NULL,
  customer_name VARCHAR(120) NOT NULL,
  customer_email VARCHAR(180) NOT NULL,
  customer_phone VARCHAR(40) NOT NULL,
  shipping_address VARCHAR(255) NOT NULL,
  city VARCHAR(120) NOT NULL,
  payment_method ENUM('transferencia', 'tarjeta', 'efectivo_entrega') NOT NULL,
  subtotal INT NOT NULL,
  shipping_cost INT NOT NULL DEFAULT 0,
  total INT NOT NULL,
  status ENUM('confirmado', 'en_preparacion', 'enviado', 'entregado') NOT NULL DEFAULT 'confirmado',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Ítems de cada orden
CREATE TABLE IF NOT EXISTS order_items (
  id VARCHAR(36) PRIMARY KEY,
  order_id VARCHAR(36) NOT NULL,
  product_id VARCHAR(36) NOT NULL,
  product_name VARCHAR(180) NOT NULL,
  unit_price INT NOT NULL,
  quantity INT NOT NULL,
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);

-- Consultas de contacto
CREATE TABLE IF NOT EXISTS contact_messages (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('nuevo', 'respondido') NOT NULL DEFAULT 'nuevo',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Solicitudes de servicio técnico
CREATE TABLE IF NOT EXISTS service_requests (
  id VARCHAR(36) PRIMARY KEY,
  ticket_code VARCHAR(24) NOT NULL UNIQUE,
  user_id VARCHAR(36) NULL,
  customer_name VARCHAR(120) NOT NULL,
  customer_email VARCHAR(180) NOT NULL,
  customer_phone VARCHAR(40) NOT NULL,
  device_model VARCHAR(140) NOT NULL,
  issue_type VARCHAR(120) NOT NULL,
  description TEXT NOT NULL,
  status ENUM('pendiente', 'en_diagnostico', 'presupuestado', 'reparado') NOT NULL DEFAULT 'pendiente',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_service_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

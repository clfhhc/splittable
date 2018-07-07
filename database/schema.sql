-- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;

-- ---
-- Table "events"
-- 
-- ---

DROP DATABASE IF EXISTS splitTable;

DROP TABLE IF EXISTS events;
		
CREATE TABLE events (
  event_id BIGINT NOT NULL AUTO_INCREMENT,
  name VARCHAR(50) NULL DEFAULT "Event",
  PRIMARY KEY (event_id)
);

-- ---
-- Table "users"
-- 
-- ---

DROP TABLE IF EXISTS users;
		
CREATE TABLE users (
  user_id BIGINT NOT NULL AUTO_INCREMENT,
  name VARCHAR(25) NOT NULL,
  PRIMARY KEY (user_id)
);

-- ---
-- Table "accounts"
-- 
-- ---

DROP TABLE IF EXISTS accounts;
		
CREATE TABLE accounts (
  id BIGINT NOT NULL AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  event_id BIGINT NOT NULL,
  current_share DECIMAL((11, 2)) NULL,
  cost DECIMAL((11,2)) NULL,
  PRIMARY KEY (id)
);

-- ---
-- Table "transactions"
-- 
-- ---

DROP TABLE IF EXISTS transactions;
		
CREATE TABLE transactions (
  transaction_id BIGINT NOT NULL AUTO_INCREMENT,
  name VARCHAR(25) NULL DEFAULT "transaction",
  type INTEGER NULL DEFAULT 1,
  description VARCHAR(100) NULL DEFAULT NULL,
  amount DECIMAL((11,2)) NULL DEFAULT 0,
  who_paid BIGINT NOT NULL,
  event_id BIGINT NOT NULL,
  PRIMARY KEY (transaction_id)
);

-- ---
-- Table "transaction_types"
-- 
-- ---

DROP TABLE IF EXISTS transaction_types;
		
CREATE TABLE transaction_types (
  type_id INTEGER NOT NULL AUTO_INCREMENT,
  name VARCHAR(25) NOT NULL,
  PRIMARY KEY (type_id)
);

-- ---
-- Table "shares"
-- 
-- ---

DROP TABLE IF EXISTS shares;
		
CREATE TABLE shares (
  id BIGINT NOT NULL AUTO_INCREMENT,
  transaction_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  share DECIMAL((11,2)) NOT NULL,
  PRIMARY KEY (id)
);

-- ---
-- Table "results"
-- 
-- ---

DROP TABLE IF EXISTS results;
		
CREATE TABLE results (
  id BIGINT NOT NULL AUTO_INCREMENT,
  result_id BIGINT NOT NULL,
  event_id BIGINT NOT NULL,
  credit_id BIGINT NOT NULL,
  debit_id BIGINT NOT NULL,
  amount DECIMAL((13,2)) NOT NULL,
  prev_result_id BIGINT NOT NULL,
  PRIMARY KEY (id)
);

-- ---
-- Table "groups"
-- 
-- ---

DROP TABLE IF EXISTS groups;
		
CREATE TABLE groups (
  id BIGINT NOT NULL AUTO_INCREMENT,
  group_id BIGINT NOT NULL,
  event_id BIGINT NOT NULL,
  subgroup_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  PRIMARY KEY (id)
);

-- ---
-- Foreign Keys 
-- ---

ALTER TABLE accounts ADD FOREIGN KEY (user_id) REFERENCES users (user_id);
ALTER TABLE accounts ADD FOREIGN KEY (event_id) REFERENCES events (event_id);
ALTER TABLE transactions ADD FOREIGN KEY (type) REFERENCES transaction_types (type_id);
ALTER TABLE transactions ADD FOREIGN KEY (who_paid) REFERENCES users (user_id);
ALTER TABLE transactions ADD FOREIGN KEY (event_id) REFERENCES events (event_id);
ALTER TABLE shares ADD FOREIGN KEY (transaction_id) REFERENCES transactions (transaction_id);
ALTER TABLE shares ADD FOREIGN KEY (user_id) REFERENCES users (user_id);
ALTER TABLE results ADD FOREIGN KEY (event_id) REFERENCES events (event_id);
ALTER TABLE results ADD FOREIGN KEY (credit_id) REFERENCES users (user_id);
ALTER TABLE results ADD FOREIGN KEY (debit_id) REFERENCES users (user_id);
ALTER TABLE groups ADD FOREIGN KEY (event_id) REFERENCES events (event_id);
ALTER TABLE groups ADD FOREIGN KEY (user_id) REFERENCES users (user_id);

-- ---
-- Table Properties
-- ---

-- ALTER TABLE events ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE users ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE accounts ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE transactions ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE transaction_types ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE shares ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE results ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE groups ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data
-- ---

-- INSERT INTO events (event_id,name) VALUES
-- ("","");
-- INSERT INTO users (user_id,name) VALUES
-- ("","");
-- INSERT INTO accounts (id,user_id,event_id,current_share,cost) VALUES
-- ("","","","","");
-- INSERT INTO transactions (transaction_id,name,type,description,amount,who_paid,event_id) VALUES
-- ("","","","","","","");
-- INSERT INTO transaction_types (type_id,name) VALUES
-- ("","");
-- INSERT INTO shares (id,transaction_id,user_id,share) VALUES
-- ("","","","");
-- INSERT INTO results (id,result_id,event_id,credit_id,debit_id,amount,prev_result_id) VALUES
-- ("","","","","","","");
-- INSERT INTO groups (id,group_id,event_id,subgroup_id,user_id) VALUES
-- ("","","","","");
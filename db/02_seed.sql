USE wokilite;

-- =====================================
-- RESTAURANT 1: Bistro Central
-- =====================================
INSERT INTO restaurants (id, name, timezone, shifts, createdAt, updatedAt) VALUES
('R1', 'Bistro Central', 'America/Argentina/Buenos_Aires',
 '[
    {"start": "12:00", "end": "16:00"},
    {"start": "20:00", "end": "23:45"}
  ]',
 '2025-09-08 00:00:00', '2025-09-08 00:00:00');

INSERT INTO sector (id, restaurantId, name, createdAt, updatedAt) VALUES
('S1', 'R1', 'Main Hall', '2025-09-08 00:00:00', '2025-09-08 00:00:00'),
('S2', 'R1', 'Terrace',  '2025-09-08 00:00:00', '2025-09-08 00:00:00');

INSERT INTO tables (id, sectorId, name, minSize, maxSize, createdAt, updatedAt) VALUES
('T1', 'S1', 'Table 1', 2, 2, '2025-09-08 00:00:00', '2025-09-08 00:00:00'),
('T2', 'S1', 'Table 2', 2, 4, '2025-09-08 00:00:00', '2025-09-08 00:00:00'),
('T3', 'S1', 'Table 3', 2, 4, '2025-09-08 00:00:00', '2025-09-08 00:00:00'),
('T4', 'S1', 'Table 4', 4, 6, '2025-09-08 00:00:00', '2025-09-08 00:00:00'),
('T5', 'S2', 'Table 5', 2, 2, '2025-09-08 00:00:00', '2025-09-08 00:00:00');

-- =====================================
-- RESTAURANT 2: La Trattoria
-- =====================================
INSERT INTO restaurants (id, name, timezone, shifts, createdAt, updatedAt) VALUES
('R2', 'La Trattoria', 'Europe/Rome',
 '[
    {"start": "11:30", "end": "15:30"},
    {"start": "19:00", "end": "23:00"}
  ]',
 '2025-09-08 00:00:00', '2025-09-08 00:00:00');

INSERT INTO sector (id, restaurantId, name, createdAt, updatedAt) VALUES
('S3', 'R2', 'Dining Room', '2025-09-08 00:00:00', '2025-09-08 00:00:00'),
('S4', 'R2', 'Patio',       '2025-09-08 00:00:00', '2025-09-08 00:00:00'),
('S5', 'R2', 'VIP Room',    '2025-09-08 00:00:00', '2025-09-08 00:00:00');

INSERT INTO tables (id, sectorId, name, minSize, maxSize, createdAt, updatedAt) VALUES
('T6', 'S3', 'Table 1', 2, 4, '2025-09-08 00:00:00', '2025-09-08 00:00:00'),
('T7', 'S3', 'Table 2', 4, 6, '2025-09-08 00:00:00', '2025-09-08 00:00:00'),
('T8', 'S4', 'Table 3', 2, 2, '2025-09-08 00:00:00', '2025-09-08 00:00:00'),
('T9', 'S4', 'Table 4', 4, 6, '2025-09-08 00:00:00', '2025-09-08 00:00:00'),
('T10', 'S5', 'VIP Table', 2, 4, '2025-09-08 00:00:00', '2025-09-08 00:00:00');

-- =====================================
-- RESTAURANT 3: Tokyo Garden
-- =====================================
INSERT INTO restaurants (id, name, timezone, shifts, createdAt, updatedAt) VALUES
('R3', 'Tokyo Garden', 'Asia/Tokyo',
 '[
    {"start": "11:00", "end": "15:00"},
    {"start": "18:00", "end": "22:00"}
  ]',
 '2025-09-08 00:00:00', '2025-09-08 00:00:00');

INSERT INTO sector (id, restaurantId, name, createdAt, updatedAt) VALUES
('S6', 'R3', 'Sushi Bar', '2025-09-08 00:00:00', '2025-09-08 00:00:00'),
('S7', 'R3', 'Tatami Room', '2025-09-08 00:00:00', '2025-09-08 00:00:00');

INSERT INTO tables (id, sectorId, name, minSize, maxSize, createdAt, updatedAt) VALUES
('T11', 'S6', 'Counter Seat 1', 1, 1, '2025-09-08 00:00:00', '2025-09-08 00:00:00'),
('T12', 'S6', 'Counter Seat 2', 1, 1, '2025-09-08 00:00:00', '2025-09-08 00:00:00'),
('T13', 'S7', 'Tatami Table 1', 2, 4, '2025-09-08 00:00:00', '2025-09-08 00:00:00'),
('T14', 'S7', 'Tatami Table 2', 4, 6, '2025-09-08 00:00:00', '2025-09-08 00:00:00');

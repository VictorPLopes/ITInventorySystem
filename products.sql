INSERT INTO Products (Name, Quantity, Description, Category, CostPrice, SalePrice, BrandManufacturerName, IsDeleted, CreatedAt)
VALUES
-- Processadores
('Intel Core i9-13900K', 10, 'Processador Intel 13ª Geração, 24 núcleos, 5.8GHz Turbo', 'Processador', 2400.00, 2899.99, 'Intel', 0, GETDATE()),
('AMD Ryzen 9 7900X', 12, 'Processador AMD Ryzen 9, 12 núcleos, 5.6GHz Turbo', 'Processador', 2100.00, 2499.90, 'AMD', 0, GETDATE()),

-- Placas de Vídeo
('NVIDIA GeForce RTX 4090', 5, 'Placa de vídeo NVIDIA RTX 4090, 24GB GDDR6X', 'Placa de Vídeo', 9200.00, 10499.99, 'NVIDIA', 0, GETDATE()),
('AMD Radeon RX 7900 XT', 6, 'Placa de vídeo AMD Radeon RX 7900 XT, 20GB GDDR6', 'Placa de Vídeo', 4600.00, 5299.99, 'AMD', 0, GETDATE()),

-- Memória RAM
('Corsair Vengeance RGB 32GB (2x16GB) DDR5 6000MHz', 15, 'Memória RAM DDR5 de alto desempenho', 'Memória RAM', 800.00, 999.90, 'Corsair', 0, GETDATE()),
('Kingston Fury Beast 16GB (2x8GB) DDR4 3200MHz', 18, 'Memória RAM DDR4 para jogos e trabalho', 'Memória RAM', 350.00, 499.90, 'Kingston', 0, GETDATE()),

-- SSDs
('Samsung 980 Pro 2TB NVMe PCIe 4.0', 10, 'SSD NVMe PCIe 4.0 de alta velocidade', 'Armazenamento', 1200.00, 1499.90, 'Samsung', 0, GETDATE()),
('Crucial P3 Plus 1TB NVMe PCIe 4.0', 15, 'SSD rápido para melhorar o desempenho', 'Armazenamento', 400.00, 599.90, 'Crucial', 0, GETDATE()),

-- HDDs
('Seagate Barracuda 4TB 7200RPM', 8, 'HD de 4TB para armazenamento em massa', 'Armazenamento', 500.00, 649.90, 'Seagate', 0, GETDATE()),
('Western Digital Blue 2TB 5400RPM', 12, 'HD confiável para armazenamento geral', 'Armazenamento', 350.00, 499.90, 'Western Digital', 0, GETDATE()),

-- Monitores
('LG Ultragear 27" 144Hz IPS', 7, 'Monitor gamer com 144Hz e 1ms de resposta', 'Monitor', 1400.00, 1799.90, 'LG', 0, GETDATE()),
('Samsung Odyssey G5 32" Curvo 165Hz', 6, 'Monitor curvo para uma experiência imersiva', 'Monitor', 1800.00, 2199.90, 'Samsung', 0, GETDATE()),

-- Teclados
('Logitech G915 TKL Wireless', 10, 'Teclado mecânico sem fio para gamers', 'Periférico', 800.00, 999.90, 'Logitech', 0, GETDATE()),
('Razer Huntsman Mini 60%', 12, 'Teclado mecânico compacto com switches ópticos', 'Periférico', 600.00, 799.90, 'Razer', 0, GETDATE()),

-- Mouses
('Logitech G Pro X Superlight', 15, 'Mouse gamer ultraleve com sensor HERO', 'Periférico', 600.00, 799.90, 'Logitech', 0, GETDATE()),
('Razer DeathAdder V3 Pro', 14, 'Mouse ergonômico com sensor óptico de 30K DPI', 'Periférico', 700.00, 899.90, 'Razer', 0, GETDATE()),

-- Headsets
('HyperX Cloud Alpha Wireless', 10, 'Headset sem fio com até 300h de bateria', 'Periférico', 800.00, 1099.90, 'HyperX', 0, GETDATE()),
('Corsair Virtuoso RGB Wireless SE', 8, 'Headset premium para áudio de alta qualidade', 'Periférico', 1000.00, 1299.90, 'Corsair', 0, GETDATE()),

-- Placas-mãe
('ASUS ROG Strix B550-F Gaming', 10, 'Placa-mãe AMD B550 para Ryzen 5000', 'Placa-mãe', 1000.00, 1249.90, 'ASUS', 0, GETDATE()),
('MSI MAG Z690 Tomahawk WiFi', 9, 'Placa-mãe Intel Z690 para 12ª Geração', 'Placa-mãe', 1400.00, 1799.90, 'MSI', 0, GETDATE()),

-- Fontes
('Corsair RM850x 80 Plus Gold', 10, 'Fonte modular de 850W com certificação Gold', 'Fonte de Alimentação', 700.00, 899.90, 'Corsair', 0, GETDATE()),
('EVGA SuperNOVA 750 G5 80 Plus Gold', 12, 'Fonte confiável para sistemas gamers', 'Fonte de Alimentação', 600.00, 799.90, 'EVGA', 0, GETDATE()),

-- Gabinetes
('NZXT H510 Elite Mid Tower', 8, 'Gabinete moderno com vidro temperado', 'Gabinete', 800.00, 999.90, 'NZXT', 0, GETDATE()),
('Cooler Master MasterBox TD500', 9, 'Gabinete espaçoso com bom fluxo de ar', 'Gabinete', 600.00, 799.90, 'Cooler Master', 0, GETDATE()),

-- Refrigeração
('Noctua NH-D15 Chromax Black', 10, 'Cooler a ar de alto desempenho', 'Refrigeração', 500.00, 649.90, 'Noctua', 0, GETDATE()),
('Corsair iCUE H150i Elite Capellix', 7, 'Watercooler de 360mm com iluminação RGB', 'Refrigeração', 900.00, 1149.90, 'Corsair', 0, GETDATE());


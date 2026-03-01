export const defaultCategories = [
  {
    nameEn: 'Appetizers',
    nameTh: 'อาหารเรียกน้ำย่อย',
    nameZh: '开胃菜',
    nameJa: '前菜',
    nameEs: 'Aperitivos',
    sortOrder: 1,
  },
  {
    nameEn: 'Soups',
    nameTh: 'ซุป',
    nameZh: '汤',
    nameJa: 'スープ',
    nameEs: 'Sopas',
    sortOrder: 2,
  },
  {
    nameEn: 'Main Course',
    nameTh: 'อาหารจานหลัก',
    nameZh: '主菜',
    nameJa: 'メインコース',
    nameEs: 'Plato principal',
    sortOrder: 3,
  },
  {
    nameEn: 'Noodles & Rice',
    nameTh: 'ก๋วยเตี๋ยวและข้าว',
    nameZh: '面条和米饭',
    nameJa: '麺類・ご飯',
    nameEs: 'Fideos y arroz',
    sortOrder: 4,
  },
  {
    nameEn: 'Drinks',
    nameTh: 'เครื่องดื่ม',
    nameZh: '饮料',
    nameJa: 'ドリンク',
    nameEs: 'Bebidas',
    sortOrder: 5,
  },
  {
    nameEn: 'Desserts',
    nameTh: 'ของหวาน',
    nameZh: '甜点',
    nameJa: 'デザート',
    nameEs: 'Postres',
    sortOrder: 6,
  },
]

export interface DefaultMenuItem {
  categoryIndex: number
  nameEn: string; nameTh: string; nameZh: string; nameJa: string; nameEs: string
  descEn: string; descTh: string; descZh: string; descJa: string; descEs: string
  price: number
  hasSpicy: boolean
  sortOrder: number
  imageUrl?: string
}

export const defaultMenuItems: DefaultMenuItem[] = [
  // === Appetizers (index 0) ===
  {
    categoryIndex: 0,
    nameEn: 'Spring Rolls', nameTh: 'ปอเปี๊ยะทอด', nameZh: '春卷', nameJa: '春巻き', nameEs: 'Rollitos de primavera',
    descEn: 'Crispy fried spring rolls with vegetables', descTh: 'ปอเปี๊ยะทอดกรอบไส้ผัก', descZh: '酥脆蔬菜春卷', descJa: 'パリパリ揚げ春巻き', descEs: 'Rollitos crujientes con verduras',
    price: 80, hasSpicy: false, sortOrder: 1, imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop',
  },
  {
    categoryIndex: 0,
    nameEn: 'Satay Chicken', nameTh: 'สะเต๊ะไก่', nameZh: '沙爹鸡肉', nameJa: 'サテーチキン', nameEs: 'Pollo satay',
    descEn: 'Grilled chicken skewers with peanut sauce', descTh: 'ไก่ย่างเสียบไม้เสิร์ฟพร้อมซอสถั่ว', descZh: '烤鸡肉串配花生酱', descJa: 'ピーナッツソース付き焼き鳥', descEs: 'Brochetas de pollo con salsa de maní',
    price: 100, hasSpicy: false, sortOrder: 2, imageUrl: 'https://images.unsplash.com/photo-1529563021893-cc83c992d75d?w=400&h=300&fit=crop',
  },
  {
    categoryIndex: 0,
    nameEn: 'Fish Cake', nameTh: 'ทอดมันปลา', nameZh: '鱼饼', nameJa: 'フィッシュケーキ', nameEs: 'Pastel de pescado',
    descEn: 'Thai fish cake served with cucumber relish', descTh: 'ทอดมันปลาเสิร์ฟกับอาจาด', descZh: '泰式鱼饼配黄瓜酱', descJa: 'キュウリ添えタイ風フィッシュケーキ', descEs: 'Pastel de pescado tailandés con pepino',
    price: 90, hasSpicy: true, sortOrder: 3, imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
  },
  {
    categoryIndex: 0,
    nameEn: 'Fresh Spring Rolls', nameTh: 'ปอเปี๊ยะสด', nameZh: '越南春卷', nameJa: '生春巻き', nameEs: 'Rollitos frescos',
    descEn: 'Rice paper rolls with shrimp and vegetables', descTh: 'ปอเปี๊ยะสดกุ้งผัก', descZh: '鲜虾蔬菜米纸卷', descJa: 'エビと野菜のライスペーパーロール', descEs: 'Rollitos de papel de arroz con camarones',
    price: 85, hasSpicy: false, sortOrder: 4, imageUrl: 'https://images.unsplash.com/photo-1562967916-eb82221dfb44?w=400&h=300&fit=crop',
  },
  // === Soups (index 1) ===
  {
    categoryIndex: 1,
    nameEn: 'Tom Yum Goong', nameTh: 'ต้มยำกุ้ง', nameZh: '冬阴功汤', nameJa: 'トムヤムクン', nameEs: 'Tom Yum con camarones',
    descEn: 'Spicy and sour shrimp soup with lemongrass', descTh: 'ต้มยำกุ้งน้ำใส', descZh: '酸辣虾汤配柠檬草', descJa: 'レモングラスのスパイシーサワーエビスープ', descEs: 'Sopa picante y ácida con camarones',
    price: 150, hasSpicy: true, sortOrder: 1, imageUrl: 'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=400&h=300&fit=crop',
  },
  {
    categoryIndex: 1,
    nameEn: 'Tom Kha Gai', nameTh: 'ต้มข่าไก่', nameZh: '椰奶鸡汤', nameJa: 'トムカーガイ', nameEs: 'Tom Kha con pollo',
    descEn: 'Coconut milk soup with chicken and galangal', descTh: 'ต้มข่าไก่น้ำกะทิ', descZh: '椰奶鸡肉南姜汤', descJa: 'ガランガル入りココナッツチキンスープ', descEs: 'Sopa de leche de coco con pollo',
    price: 140, hasSpicy: true, sortOrder: 2, imageUrl: 'https://images.unsplash.com/photo-1569058242567-93de6f36f8eb?w=400&h=300&fit=crop',
  },
  {
    categoryIndex: 1,
    nameEn: 'Wonton Soup', nameTh: 'เกี๊ยวน้ำ', nameZh: '馄饨汤', nameJa: 'ワンタンスープ', nameEs: 'Sopa de wonton',
    descEn: 'Clear broth with pork wontons', descTh: 'เกี๊ยวน้ำหมูสับ', descZh: '猪肉馄饨清汤', descJa: '豚肉ワンタンスープ', descEs: 'Caldo con wontons de cerdo',
    price: 90, hasSpicy: false, sortOrder: 3, imageUrl: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&h=300&fit=crop',
  },
  // === Main Course (index 2) ===
  {
    categoryIndex: 2,
    nameEn: 'Pad Thai', nameTh: 'ผัดไทย', nameZh: '泰式炒粉', nameJa: 'パッタイ', nameEs: 'Pad Thai',
    descEn: 'Stir-fried rice noodles with shrimp and peanuts', descTh: 'ผัดไทยกุ้งสด', descZh: '虾仁炒河粉配花生', descJa: 'エビとピーナッツの焼きそば', descEs: 'Fideos de arroz salteados con camarones',
    price: 120, hasSpicy: false, sortOrder: 1, imageUrl: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&h=300&fit=crop',
  },
  {
    categoryIndex: 2,
    nameEn: 'Green Curry Chicken', nameTh: 'แกงเขียวหวานไก่', nameZh: '绿咖喱鸡', nameJa: 'グリーンカレーチキン', nameEs: 'Curry verde con pollo',
    descEn: 'Thai green curry with chicken and Thai eggplant', descTh: 'แกงเขียวหวานไก่มะเขือ', descZh: '泰式绿咖喱鸡配茄子', descJa: 'タイナス入りグリーンカレーチキン', descEs: 'Curry verde tailandés con pollo y berenjena',
    price: 150, hasSpicy: true, sortOrder: 2, imageUrl: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop',
  },
  {
    categoryIndex: 2,
    nameEn: 'Massaman Curry', nameTh: 'แกงมัสมั่น', nameZh: '马沙曼咖喱', nameJa: 'マッサマンカレー', nameEs: 'Curry massaman',
    descEn: 'Rich curry with potatoes, peanuts and chicken', descTh: 'แกงมัสมั่นไก่มันฝรั่ง', descZh: '马沙曼咖喱鸡配土豆花生', descJa: 'ジャガイモとピーナッツ入りマッサマンカレー', descEs: 'Curry con papas, maní y pollo',
    price: 160, hasSpicy: true, sortOrder: 3, imageUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=300&fit=crop',
  },
  {
    categoryIndex: 2,
    nameEn: 'Stir-Fried Basil Pork', nameTh: 'ผัดกะเพราหมู', nameZh: '打抛猪肉', nameJa: 'バジル炒め豚肉', nameEs: 'Cerdo salteado con albahaca',
    descEn: 'Stir-fried minced pork with holy basil and fried egg', descTh: 'ผัดกะเพราหมูสับ ไข่ดาว', descZh: '打抛猪肉碎配煎蛋', descJa: 'ホーリーバジルと目玉焼き入り豚ひき肉炒め', descEs: 'Cerdo picado salteado con albahaca y huevo frito',
    price: 100, hasSpicy: true, sortOrder: 4, imageUrl: 'https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=400&h=300&fit=crop',
  },
  {
    categoryIndex: 2,
    nameEn: 'Sweet & Sour Pork', nameTh: 'ผัดเปรี้ยวหวานหมู', nameZh: '糖醋肉', nameJa: '酢豚', nameEs: 'Cerdo agridulce',
    descEn: 'Pork stir-fried with pineapple in sweet and sour sauce', descTh: 'ผัดเปรี้ยวหวานหมูกับสับปะรด', descZh: '菠萝糖醋肉', descJa: 'パイナップル入り酢豚', descEs: 'Cerdo salteado con piña en salsa agridulce',
    price: 120, hasSpicy: false, sortOrder: 5, imageUrl: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&h=300&fit=crop',
  },
  {
    categoryIndex: 2,
    nameEn: 'Red Curry Duck', nameTh: 'แกงเผ็ดเป็ด', nameZh: '红咖喱鸭', nameJa: 'レッドカレーダック', nameEs: 'Curry rojo con pato',
    descEn: 'Red curry with roasted duck and pineapple', descTh: 'แกงเผ็ดเป็ดย่างสับปะรด', descZh: '红咖喱烤鸭配菠萝', descJa: 'ローストダックとパイナップルのレッドカレー', descEs: 'Curry rojo con pato asado y piña',
    price: 180, hasSpicy: true, sortOrder: 6, imageUrl: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop',
  },
  {
    categoryIndex: 2,
    nameEn: 'Grilled Fish with Lime', nameTh: 'ปลากะพงมะนาว', nameZh: '柠檬蒸鱼', nameJa: 'ライム焼き魚', nameEs: 'Pescado a la parrilla con limón',
    descEn: 'Grilled sea bass with spicy lime sauce', descTh: 'ปลากะพงนึ่งมะนาว', descZh: '柠檬辣酱蒸鲈鱼', descJa: 'スパイシーライムソースの焼きスズキ', descEs: 'Lubina a la parrilla con salsa de limón picante',
    price: 220, hasSpicy: true, sortOrder: 7, imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=300&fit=crop',
  },
  {
    categoryIndex: 2,
    nameEn: 'Cashew Nut Chicken', nameTh: 'ไก่ผัดเม็ดมะม่วงหิมพานต์', nameZh: '腰果鸡丁', nameJa: 'カシューナッツチキン', nameEs: 'Pollo con anacardos',
    descEn: 'Stir-fried chicken with cashew nuts and dried chili', descTh: 'ไก่ผัดเม็ดมะม่วงหิมพานต์พริกแห้ง', descZh: '腰果鸡丁配干辣椒', descJa: 'カシューナッツと唐辛子のチキン炒め', descEs: 'Pollo salteado con anacardos y chile seco',
    price: 140, hasSpicy: true, sortOrder: 8, imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop',
  },
  {
    categoryIndex: 2,
    nameEn: 'Stir-Fried Morning Glory', nameTh: 'ผัดผักบุ้งไฟแดง', nameZh: '炒空心菜', nameJa: '空心菜炒め', nameEs: 'Espinaca de agua salteada',
    descEn: 'Stir-fried morning glory with garlic and chili', descTh: 'ผัดผักบุ้งไฟแดง กระเทียมพริก', descZh: '蒜辣炒空心菜', descJa: 'ニンニクと唐辛子の空心菜炒め', descEs: 'Espinaca de agua con ajo y chile',
    price: 80, hasSpicy: true, sortOrder: 9, imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop',
  },
  // === Noodles & Rice (index 3) ===
  {
    categoryIndex: 3,
    nameEn: 'Fried Rice', nameTh: 'ข้าวผัด', nameZh: '炒饭', nameJa: 'チャーハン', nameEs: 'Arroz frito',
    descEn: 'Thai-style fried rice with egg and vegetables', descTh: 'ข้าวผัดไข่ผัก', descZh: '泰式蛋炒饭配蔬菜', descJa: 'タイ風卵と野菜のチャーハン', descEs: 'Arroz frito con huevo y verduras',
    price: 90, hasSpicy: false, sortOrder: 1, imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop',
  },
  {
    categoryIndex: 3,
    nameEn: 'Pineapple Fried Rice', nameTh: 'ข้าวผัดสับปะรด', nameZh: '菠萝炒饭', nameJa: 'パイナップルチャーハン', nameEs: 'Arroz frito con piña',
    descEn: 'Fried rice with pineapple, cashew nuts and raisins', descTh: 'ข้าวผัดสับปะรดเม็ดมะม่วง', descZh: '菠萝炒饭配腰果葡萄干', descJa: 'パイナップルとカシューナッツのチャーハン', descEs: 'Arroz frito con piña, anacardos y pasas',
    price: 120, hasSpicy: false, sortOrder: 2, imageUrl: 'https://images.unsplash.com/photo-1512058454905-6b841e7ad132?w=400&h=300&fit=crop',
  },
  {
    categoryIndex: 3,
    nameEn: 'Boat Noodles', nameTh: 'ก๋วยเตี๋ยวเรือ', nameZh: '船面', nameJa: 'ボートヌードル', nameEs: 'Fideos de bote',
    descEn: 'Thai boat noodles with rich broth and pork', descTh: 'ก๋วยเตี๋ยวเรือน้ำตก', descZh: '泰式船面配浓汤猪肉', descJa: '濃厚スープのタイ風ボートヌードル', descEs: 'Fideos tailandeses con caldo rico y cerdo',
    price: 70, hasSpicy: true, sortOrder: 3, imageUrl: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=300&fit=crop',
  },
  {
    categoryIndex: 3,
    nameEn: 'Steamed Rice', nameTh: 'ข้าวสวย', nameZh: '白饭', nameJa: 'ライス', nameEs: 'Arroz al vapor',
    descEn: 'Steamed jasmine rice', descTh: 'ข้าวหอมมะลิ', descZh: '茉莉香米饭', descJa: 'ジャスミンライス', descEs: 'Arroz jazmín al vapor',
    price: 20, hasSpicy: false, sortOrder: 4, imageUrl: 'https://images.unsplash.com/photo-1536304993881-460e4c8ce1db?w=400&h=300&fit=crop',
  },
  // === Drinks (index 4) ===
  {
    categoryIndex: 4,
    nameEn: 'Thai Iced Tea', nameTh: 'ชาเย็น', nameZh: '泰式奶茶', nameJa: 'タイアイスティー', nameEs: 'Té helado tailandés',
    descEn: 'Sweet Thai tea with condensed milk', descTh: 'ชาไทยเย็นใส่นมข้น', descZh: '泰式炼乳奶茶', descJa: 'コンデンスミルク入りタイティー', descEs: 'Té tailandés dulce con leche condensada',
    price: 50, hasSpicy: false, sortOrder: 1, imageUrl: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=400&h=300&fit=crop',
  },
  {
    categoryIndex: 4,
    nameEn: 'Fresh Coconut Water', nameTh: 'น้ำมะพร้าว', nameZh: '鲜椰子水', nameJa: 'フレッシュココナッツウォーター', nameEs: 'Agua de coco fresca',
    descEn: 'Fresh young coconut water', descTh: 'น้ำมะพร้าวอ่อน', descZh: '新鲜嫩椰子水', descJa: '新鮮なヤングココナッツウォーター', descEs: 'Agua de coco joven fresca',
    price: 60, hasSpicy: false, sortOrder: 2, imageUrl: 'https://images.unsplash.com/photo-1525385133512-2f3bdd585e1b?w=400&h=300&fit=crop',
  },
  {
    categoryIndex: 4,
    nameEn: 'Mango Smoothie', nameTh: 'มะม่วงปั่น', nameZh: '芒果冰沙', nameJa: 'マンゴースムージー', nameEs: 'Batido de mango',
    descEn: 'Fresh mango blended with ice', descTh: 'มะม่วงปั่นน้ำแข็ง', descZh: '新鲜芒果冰沙', descJa: 'フレッシュマンゴーのスムージー', descEs: 'Mango fresco con hielo',
    price: 70, hasSpicy: false, sortOrder: 3, imageUrl: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=300&fit=crop',
  },
  {
    categoryIndex: 4,
    nameEn: 'Singha Beer', nameTh: 'เบียร์สิงห์', nameZh: '胜狮啤酒', nameJa: 'シンハービール', nameEs: 'Cerveza Singha',
    descEn: 'Thai lager beer 330ml', descTh: 'เบียร์สิงห์ 330 มล.', descZh: '泰国拉格啤酒330毫升', descJa: 'タイラガービール330ml', descEs: 'Cerveza lager tailandesa 330ml',
    price: 80, hasSpicy: false, sortOrder: 4, imageUrl: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=300&fit=crop',
  },
  {
    categoryIndex: 4,
    nameEn: 'Iced Coffee', nameTh: 'กาแฟเย็น', nameZh: '冰咖啡', nameJa: 'アイスコーヒー', nameEs: 'Café helado',
    descEn: 'Thai-style iced coffee with milk', descTh: 'กาแฟเย็นใส่นม', descZh: '泰式牛奶冰咖啡', descJa: 'ミルク入りタイ風アイスコーヒー', descEs: 'Café helado con leche',
    price: 50, hasSpicy: false, sortOrder: 5, imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop',
  },
  {
    categoryIndex: 4,
    nameEn: 'Lemon Soda', nameTh: 'น้ำมะนาวโซดา', nameZh: '柠檬苏打', nameJa: 'レモンソーダ', nameEs: 'Soda de limón',
    descEn: 'Fresh lime soda', descTh: 'น้ำมะนาวโซดาสด', descZh: '鲜柠檬苏打水', descJa: 'フレッシュライムソーダ', descEs: 'Soda de lima fresca',
    price: 45, hasSpicy: false, sortOrder: 6, imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed514?w=400&h=300&fit=crop',
  },
  {
    categoryIndex: 4,
    nameEn: 'Water', nameTh: 'น้ำเปล่า', nameZh: '矿泉水', nameJa: '水', nameEs: 'Agua',
    descEn: 'Bottled drinking water', descTh: 'น้ำดื่มขวด', descZh: '瓶装饮用水', descJa: 'ボトルウォーター', descEs: 'Agua embotellada',
    price: 20, hasSpicy: false, sortOrder: 7, imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=300&fit=crop',
  },
  // === Desserts (index 5) ===
  {
    categoryIndex: 5,
    nameEn: 'Mango Sticky Rice', nameTh: 'ข้าวเหนียวมะม่วง', nameZh: '芒果糯米饭', nameJa: 'マンゴーもち米', nameEs: 'Arroz pegajoso con mango',
    descEn: 'Sweet sticky rice with fresh mango and coconut milk', descTh: 'ข้าวเหนียวมะม่วงราดน้ำกะทิ', descZh: '新鲜芒果糯米饭配椰奶', descJa: 'フレッシュマンゴーとココナッツミルクのもち米', descEs: 'Arroz glutinoso con mango y leche de coco',
    price: 100, hasSpicy: false, sortOrder: 1, imageUrl: 'https://images.unsplash.com/photo-1596451190630-186aff535bf2?w=400&h=300&fit=crop',
  },
  {
    categoryIndex: 5,
    nameEn: 'Coconut Ice Cream', nameTh: 'ไอศกรีมกะทิ', nameZh: '椰子冰淇淋', nameJa: 'ココナッツアイス', nameEs: 'Helado de coco',
    descEn: 'Homemade coconut ice cream with peanut topping', descTh: 'ไอศกรีมกะทิโรยถั่ว', descZh: '椰子冰淇淋配花生', descJa: 'ピーナッツトッピングのココナッツアイス', descEs: 'Helado de coco con maní',
    price: 60, hasSpicy: false, sortOrder: 2, imageUrl: 'https://images.unsplash.com/photo-1570197571499-166b36435e9f?w=400&h=300&fit=crop',
  },
  {
    categoryIndex: 5,
    nameEn: 'Banana in Coconut Milk', nameTh: 'กล้วยบวชชี', nameZh: '椰奶香蕉', nameJa: 'バナナのココナッツミルク', nameEs: 'Plátano en leche de coco',
    descEn: 'Warm banana in sweet coconut milk', descTh: 'กล้วยบวชชีน้ำกะทิหวาน', descZh: '椰奶甜煮香蕉', descJa: '甘いココナッツミルクのバナナ', descEs: 'Plátano en leche de coco dulce',
    price: 50, hasSpicy: false, sortOrder: 3, imageUrl: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=400&h=300&fit=crop',
  },
]

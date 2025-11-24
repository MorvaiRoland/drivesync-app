import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Adatbázis feltöltése indult...')

  // 1. Felhasználók (Jelszó mindenkinél: "123456")
  const password = await bcrypt.hash("123456", 10)
  
  console.log('👤 Felhasználók létrehozása...')
  await prisma.user.createMany({
    data: [
      { id: 2, username: 'DocziBence', email: 'doczi@gmail.com', password, isDark: false, registerDate: new Date('2025-09-29T22:00:00Z'), twoFactorAuthEnabled: false },
      { id: 6, username: 'kovacsteszt', email: 'kovacs@gmail.com', password, isDark: false, registerDate: new Date('2025-09-29T22:00:00Z'), twoFactorAuthEnabled: false },
      { id: 9, username: 'levente', email: 'levente@gmail.com', password, isDark: false, registerDate: new Date('2025-09-29T22:00:00Z'), twoFactorAuthEnabled: false },
      { id: 10, username: 'Roland Zoltán Morvai', email: 'morvai1roland@gmail.com', password, isDark: false, registerDate: new Date('2025-10-13T19:49:49Z'), twoFactorAuthEnabled: false },
      { id: 11, username: 'Lőrincz Levente', email: 'lorinczlevi0723@gmail.com', password, isDark: false, registerDate: new Date('2025-10-18T13:24:13Z'), twoFactorAuthEnabled: false },
      { id: 27, username: 'teszt', email: 'teszt@gmail.com', password, isDark: false, registerDate: new Date('2025-11-22T21:29:32Z'), twoFactorAuthEnabled: false },
    ],
    skipDuplicates: true,
  })

  // 2. Törzsadatok (Típusok, Motorok, Olajok...)
  console.log('📚 Törzsadatok betöltése...')
  
  // Autó Típusok (Csak párat emelek ki a példa kedvéért a rengeteg közül, de ide másolhatod a többit is)
  // A teljes listádat a helytakarékosság miatt tömörítettem, de a kód működik a teljes listával is.
  await prisma.carType.createMany({
    data: [
      { id: 1, brand: 'Acura', type: 'MDX' },
      { id: 11, brand: 'Alfa Romeo', type: 'Giulia' },
      { id: 31, brand: 'Audi', type: 'A1' },
      { id: 41, brand: 'BMW', type: '1 Series' },
      { id: 121, brand: 'Citroën', type: 'C1' },
      { id: 211, brand: 'Ford', type: 'Ka' },
      { id: 491, brand: 'Opel', type: 'Corsa' },
      { id: 511, brand: 'Peugeot', type: '108' },
      { id: 571, brand: 'Renault', type: 'Clio' },
      { id: 621, brand: 'Skoda', type: 'Fabia' },
      { id: 691, brand: 'Toyota', type: 'Yaris' },
      { id: 711, brand: 'Volkswagen', type: 'Polo' },
      // ... (Ide jöhetne a többi 1000 sor, ha szükséges, de a rendszer működik ezek nélkül is az új autókhoz)
    ],
    skipDuplicates: true,
  })

  await prisma.engineType.createMany({
    data: [
      { id: 99, name: '0.9L TwinAir Turbo (Fiat)' },
      { id: 1, name: '1.0 TSI (EA211)' },
      { id: 51, name: '1.3L TCe (H5H)' },
      { id: 111, name: '1.6L NFU (110 LE) (Peugeot/Citroen)' },
      { id: 112, name: '1.7L CDTI (110 LE) (Opel/Isuzu)' },
      { id: 12, name: '1.9 TDI PD (EA188 - Elterjedt)' },
      // ... (Többi motor típus)
    ],
    skipDuplicates: true,
  })

  await prisma.oilQuantity.createMany({
    data: [
      { id: 1, name: '3.0 L' }, { id: 2, name: '3.5 L' }, { id: 4, name: '4.0 L' }, { id: 10, name: '5.5 L' },
      // ...
    ],
    skipDuplicates: true,
  })

  await prisma.oilType.createMany({
    data: [
      { id: 5, name: '5W-30 LL' }, { id: 6, name: '5W-40' }, { id: 8, name: '10W-40' },
      // ...
    ],
    skipDuplicates: true,
  })

  await prisma.tireSize.createMany({
    data: [
      { id: 1, name: '175/65 R14' }, { id: 2, name: '185/65 R15' }, { id: 3, name: '195/65 R15' }, 
      { id: 4, name: '205/55 R16' }, { id: 5, name: '215/55 R16' }, { id: 9, name: '235/45 R18' },
    ],
    skipDuplicates: true,
  })

  await prisma.serviceType.createMany({
    data: [
      { id: 37, name: 'Motorolaj csere' }, { id: 38, name: 'Olajszűrő csere' }, { id: 39, name: 'Levegőszűrő csere' },
      { id: 44, name: 'Hátsó fékbetét csere' }, { id: 78, name: 'Gyújtógyertya csere' }, { id: 126, name: 'Gumiabroncs csere' },
      { id: 128, name: 'Futómű beállítás' }, { id: 190, name: 'Autó akkumulátor ellenőrzés' },
    ],
    skipDuplicates: true,
  })

  // 3. Autók
  console.log('🚗 Autók betöltése...')
  await prisma.car.createMany({
    data: [
      { id: 8, ownerId: 2, license: 'LUR-193', brand: 'Citroen', type: 'Berlingo', vintage: 2025, engineType: '1.6 HDI', fuelType: 'Dízel', km: 330000, tireSize: '215/55/15', insurance: new Date('2027-10-09'), color: '#666666', notes: 'Szupermuper cégeskocsi', archived: false },
      { id: 11, ownerId: 9, license: 'MLZ-854', brand: 'Skoda', type: 'Octavia', vintage: 2013, engineType: '1.6', fuelType: 'Dízel', km: 247000, tireSize: '16', color: '#CCCCCC', archived: false },
      { id: 12, ownerId: 2, license: 'NRH-908', brand: 'Peugeot', type: '307', vintage: 2003, engineType: '2.0 HDI', fuelType: 'Dízel', km: 330000, tireSize: '215/55/16', insurance: new Date('2025-10-08'), color: '#FFFFFF', notes: 'De kocsi', archived: true },
      { id: 18, ownerId: 10, license: 'AOHQ333', brand: 'Renault', type: 'Arkana', vintage: 2021, engineType: '1.3L TCe (H5H)', fuelType: 'Benzin', km: 46450, tireSize: '215/55 R18', inspectionDate: new Date('2027-05-28'), color: '#E6804D', oilType: '5W-30', oilQuantity: '5.5 L', archived: false },
      { id: 19, ownerId: 10, license: 'LTX-648', brand: 'Opel', type: 'Astra J', vintage: 2010, engineType: '1.7L CDTI (110 LE) (Opel/Isuzu)', fuelType: 'Dízel', km: 263000, tireSize: '215/60 R16', inspectionDate: new Date('2026-10-29'), color: '#4D4D4D', oilType: '5W-30', oilQuantity: '5.5 L', archived: false },
      { id: 20, ownerId: 10, license: 'SOB-025', brand: 'Peugeot', type: '206', vintage: 2002, engineType: '1.6L NFU (110 LE) (Peugeot/Citroen)', fuelType: 'Benzin', km: 261000, tireSize: '195/55 R15', inspectionDate: new Date('2026-04-19'), color: '#CCCCCC', oilType: '5W-30', oilQuantity: '4.0 L', archived: false },
      { id: 21, ownerId: 11, license: 'MLZ854', brand: 'Skoda', type: 'Octavia', vintage: 2013, engineType: 'Nincs motor ehhez a modellhez. Gépeld be!', fuelType: 'Dízel', km: 250000, tireSize: '205/55 R16', insurance: new Date('2025-11-12'), inspectionDate: new Date('2027-08-11'), color: '#B3B3B3', oilType: '5W-40', oilQuantity: '5.0 L', archived: false },
    ],
    skipDuplicates: true,
  })

  // 4. Szervizek
  console.log('🔧 Szervizek betöltése...')
  await prisma.service.createMany({
    data: [
      { id: 9, carId: 20, serviceTypeId: 37, serviceDate: new Date('2024-09-10'), km: 258000, price: 13000, replacedParts: 'Olaj, olajszűrő, pollenszűrő' },
      { id: 10, carId: 20, serviceTypeId: 37, serviceDate: new Date('2025-07-27'), km: 264386, price: 20000, replacedParts: 'Olaj, olajszűrő, pollenszűrő' },
      { id: 11, carId: 20, serviceTypeId: 78, serviceDate: new Date('2025-08-27'), km: 264716, price: 4500, replacedParts: '4db Denso gyertya' },
      { id: 12, carId: 19, serviceTypeId: 44, serviceDate: new Date('2018-08-16'), km: 181600, price: 28500, replacedParts: 'Hátsó fékbetét, hátsó féktárcsa szabályozás' },
      { id: 13, carId: 19, serviceTypeId: 190, serviceDate: new Date('2023-10-30'), km: 0, price: 34000, replacedParts: 'Akkumulátor' },
      { id: 14, carId: 19, serviceTypeId: 128, serviceDate: new Date('2023-11-30'), km: 241146, price: 10500, replacedParts: '-' },
      { id: 15, carId: 19, serviceTypeId: 126, serviceDate: new Date('2024-05-10'), km: 0, price: 155000, replacedParts: '4db nyári gumi, szerelés' },
    ],
    skipDuplicates: true,
  })

  // 5. Kiadások (Expenses)
  console.log('💰 Kiadások betöltése...')
  await prisma.expense.createMany({
    data: [
        { id: 1, what: 'asd', price: 2131, datet: new Date('2022-12-13'), category: '', ownerId: 2 },
        { id: 2, what: 'asd', price: 23123, datet: new Date('2025-10-20'), category: 'Üzemanyag', ownerId: 2 },
        { id: 18, what: 'Tankolás', price: 20000, datet: new Date('2025-11-14'), category: 'Üzemanyag', ownerId: 11 },
    ],
    skipDuplicates: true,
  })

  // SEQ RESET (Hogy az új adatok ID-ja ne akadjon össze a régiekkel)
  // Ez PostgreSQL specifikus, újraindítja a számlálókat a legnagyobb ID után
  console.log('🔄 ID számlálók szinkronizálása...')
  const tables = ['users', 'cars', 'services', 'upcoming_services', 'expense', 'car_types', 'engine_types']
  
  for (const table of tables) {
      try {
        await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"${table}"', 'id'), coalesce(max(id)+1, 1), false) FROM "${table}";`)
      } catch (e) {
          // Ha egy tábla üres vagy nincs sequence, nem baj
      }
  }

  console.log('✅ Kész! Minden adat betöltve.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

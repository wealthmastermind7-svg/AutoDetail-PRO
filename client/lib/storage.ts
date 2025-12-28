import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  isActive: boolean;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalBookings: number;
  totalSpent: number;
  createdAt: string;
}

export interface Booking {
  id: string;
  customerId: string;
  serviceId: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  totalPrice: number;
  notes: string;
  vehicleInfo: string;
  createdAt: string;
}

export interface Availability {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface BusinessInfo {
  name: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  slug: string;
}

const KEYS = {
  SERVICES: "autodetail_services",
  CUSTOMERS: "autodetail_customers",
  BOOKINGS: "autodetail_bookings",
  AVAILABILITY: "autodetail_availability",
  BUSINESS_INFO: "autodetail_business_info",
  ONBOARDING: "autodetail_onboarding_completed",
};

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const DEFAULT_SERVICES: Service[] = [
  {
    id: generateId(),
    name: "Express Wash",
    description: "Quick exterior wash and dry, perfect for maintaining your vehicle between details.",
    duration: 30,
    price: 3500,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    name: "Interior Detail",
    description: "Deep clean of all interior surfaces, vacuuming, and conditioning of leather and plastics.",
    duration: 60,
    price: 7500,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    name: "Exterior Detail",
    description: "Hand wash, clay bar treatment, polish, and wax for a showroom-quality finish.",
    duration: 90,
    price: 10000,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    name: "Full Detail",
    description: "Complete interior and exterior detail package for the ultimate clean.",
    duration: 120,
    price: 15000,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    name: "Ceramic Coating",
    description: "Professional-grade ceramic coating for long-lasting protection and shine.",
    duration: 180,
    price: 30000,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    name: "Paint Correction",
    description: "Multi-stage polishing to remove swirls, scratches, and imperfections.",
    duration: 240,
    price: 40000,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

const DEFAULT_AVAILABILITY: Availability[] = [
  { dayOfWeek: 0, startTime: "09:00", endTime: "17:00", isActive: false },
  { dayOfWeek: 1, startTime: "09:00", endTime: "17:00", isActive: true },
  { dayOfWeek: 2, startTime: "09:00", endTime: "17:00", isActive: true },
  { dayOfWeek: 3, startTime: "09:00", endTime: "17:00", isActive: true },
  { dayOfWeek: 4, startTime: "09:00", endTime: "17:00", isActive: true },
  { dayOfWeek: 5, startTime: "09:00", endTime: "17:00", isActive: true },
  { dayOfWeek: 6, startTime: "09:00", endTime: "14:00", isActive: true },
];

const DEFAULT_BUSINESS_INFO: BusinessInfo = {
  name: "AutoDetail Pro",
  phone: "",
  email: "",
  website: "",
  address: "",
  slug: "autodetailpro",
};

export const storage = {
  async getServices(): Promise<Service[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.SERVICES);
      if (!data) {
        await this.setServices(DEFAULT_SERVICES);
        return DEFAULT_SERVICES;
      }
      return JSON.parse(data);
    } catch (error) {
      console.error("Error getting services:", error);
      return DEFAULT_SERVICES;
    }
  },

  async setServices(services: Service[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.SERVICES, JSON.stringify(services));
    } catch (error) {
      console.error("Error setting services:", error);
    }
  },

  async addService(service: Omit<Service, "id" | "createdAt">): Promise<Service> {
    const newService: Service = {
      ...service,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    const services = await this.getServices();
    services.push(newService);
    await this.setServices(services);
    return newService;
  },

  async updateService(id: string, updates: Partial<Service>): Promise<Service | null> {
    const services = await this.getServices();
    const index = services.findIndex((s) => s.id === id);
    if (index === -1) return null;
    services[index] = { ...services[index], ...updates };
    await this.setServices(services);
    return services[index];
  },

  async deleteService(id: string): Promise<boolean> {
    const services = await this.getServices();
    const filtered = services.filter((s) => s.id !== id);
    await this.setServices(filtered);
    return filtered.length !== services.length;
  },

  async getCustomers(): Promise<Customer[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.CUSTOMERS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error getting customers:", error);
      return [];
    }
  },

  async setCustomers(customers: Customer[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.CUSTOMERS, JSON.stringify(customers));
    } catch (error) {
      console.error("Error setting customers:", error);
    }
  },

  async addCustomer(customer: Omit<Customer, "id" | "createdAt" | "totalBookings" | "totalSpent">): Promise<Customer> {
    const newCustomer: Customer = {
      ...customer,
      id: generateId(),
      totalBookings: 0,
      totalSpent: 0,
      createdAt: new Date().toISOString(),
    };
    const customers = await this.getCustomers();
    customers.push(newCustomer);
    await this.setCustomers(customers);
    return newCustomer;
  },

  async updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer | null> {
    const customers = await this.getCustomers();
    const index = customers.findIndex((c) => c.id === id);
    if (index === -1) return null;
    customers[index] = { ...customers[index], ...updates };
    await this.setCustomers(customers);
    return customers[index];
  },

  async getCustomerByEmail(email: string): Promise<Customer | undefined> {
    const customers = await this.getCustomers();
    return customers.find((c) => c.email.toLowerCase() === email.toLowerCase());
  },

  async getBookings(): Promise<Booking[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.BOOKINGS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error getting bookings:", error);
      return [];
    }
  },

  async setBookings(bookings: Booking[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.BOOKINGS, JSON.stringify(bookings));
    } catch (error) {
      console.error("Error setting bookings:", error);
    }
  },

  async addBooking(booking: Omit<Booking, "id" | "createdAt">): Promise<Booking> {
    const newBooking: Booking = {
      ...booking,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    const bookings = await this.getBookings();
    bookings.push(newBooking);
    await this.setBookings(bookings);

    const customers = await this.getCustomers();
    const customerIndex = customers.findIndex((c) => c.id === booking.customerId);
    if (customerIndex !== -1) {
      customers[customerIndex].totalBookings += 1;
      customers[customerIndex].totalSpent += booking.totalPrice;
      await this.setCustomers(customers);
    }

    return newBooking;
  },

  async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking | null> {
    const bookings = await this.getBookings();
    const index = bookings.findIndex((b) => b.id === id);
    if (index === -1) return null;
    bookings[index] = { ...bookings[index], ...updates };
    await this.setBookings(bookings);
    return bookings[index];
  },

  async getBookingsByDate(date: string): Promise<Booking[]> {
    const bookings = await this.getBookings();
    return bookings.filter((b) => b.date === date);
  },

  async getBookingsForDateRange(startDate: string, endDate: string): Promise<Booking[]> {
    const bookings = await this.getBookings();
    return bookings.filter((b) => b.date >= startDate && b.date <= endDate);
  },

  async getAvailability(): Promise<Availability[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.AVAILABILITY);
      if (!data) {
        await this.setAvailability(DEFAULT_AVAILABILITY);
        return DEFAULT_AVAILABILITY;
      }
      return JSON.parse(data);
    } catch (error) {
      console.error("Error getting availability:", error);
      return DEFAULT_AVAILABILITY;
    }
  },

  async setAvailability(availability: Availability[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.AVAILABILITY, JSON.stringify(availability));
    } catch (error) {
      console.error("Error setting availability:", error);
    }
  },

  async updateDayAvailability(dayOfWeek: number, updates: Partial<Availability>): Promise<void> {
    const availability = await this.getAvailability();
    const index = availability.findIndex((a) => a.dayOfWeek === dayOfWeek);
    if (index !== -1) {
      availability[index] = { ...availability[index], ...updates };
      await this.setAvailability(availability);
    }
  },

  async getBusinessInfo(): Promise<BusinessInfo> {
    try {
      const data = await AsyncStorage.getItem(KEYS.BUSINESS_INFO);
      if (!data) {
        await this.setBusinessInfo(DEFAULT_BUSINESS_INFO);
        return DEFAULT_BUSINESS_INFO;
      }
      return JSON.parse(data);
    } catch (error) {
      console.error("Error getting business info:", error);
      return DEFAULT_BUSINESS_INFO;
    }
  },

  async setBusinessInfo(info: BusinessInfo): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.BUSINESS_INFO, JSON.stringify(info));
    } catch (error) {
      console.error("Error setting business info:", error);
    }
  },

  async getAvailableSlots(date: string, serviceDuration: number): Promise<string[]> {
    const dayOfWeek = new Date(date).getDay();
    const availability = await this.getAvailability();
    const dayAvail = availability.find((a) => a.dayOfWeek === dayOfWeek);

    if (!dayAvail || !dayAvail.isActive) return [];

    const bookings = await this.getBookingsByDate(date);
    const services = await this.getServices();

    const slots: string[] = [];
    const startHour = parseInt(dayAvail.startTime.split(":")[0]);
    const endHour = parseInt(dayAvail.endTime.split(":")[0]);

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeStr = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        const slotEnd = new Date(`2000-01-01T${timeStr}`);
        slotEnd.setMinutes(slotEnd.getMinutes() + serviceDuration);

        if (slotEnd.getHours() > endHour || (slotEnd.getHours() === endHour && slotEnd.getMinutes() > 0)) {
          continue;
        }

        const isConflict = bookings.some((booking) => {
          if (booking.status === "cancelled") return false;
          const bookedService = services.find((s) => s.id === booking.serviceId);
          if (!bookedService) return false;

          const bookingStart = new Date(`2000-01-01T${booking.time}`);
          const bookingEnd = new Date(bookingStart);
          bookingEnd.setMinutes(bookingEnd.getMinutes() + bookedService.duration);

          const slotStart = new Date(`2000-01-01T${timeStr}`);
          const slotEndTime = new Date(slotStart);
          slotEndTime.setMinutes(slotEndTime.getMinutes() + serviceDuration);

          return slotStart < bookingEnd && slotEndTime > bookingStart;
        });

        if (!isConflict) {
          slots.push(timeStr);
        }
      }
    }

    return slots;
  },

  async loadDemoData(): Promise<void> {
    const demoCustomers: Customer[] = [
      {
        id: generateId(),
        name: "John Smith",
        email: "john.smith@email.com",
        phone: "(555) 123-4567",
        totalBookings: 3,
        totalSpent: 32500,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: generateId(),
        name: "Sarah Johnson",
        email: "sarah.j@email.com",
        phone: "(555) 234-5678",
        totalBookings: 5,
        totalSpent: 48000,
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: generateId(),
        name: "Mike Williams",
        email: "mike.w@email.com",
        phone: "(555) 345-6789",
        totalBookings: 2,
        totalSpent: 25000,
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: generateId(),
        name: "Emily Brown",
        email: "emily.brown@email.com",
        phone: "(555) 456-7890",
        totalBookings: 1,
        totalSpent: 15000,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: generateId(),
        name: "David Lee",
        email: "david.lee@email.com",
        phone: "(555) 567-8901",
        totalBookings: 4,
        totalSpent: 55000,
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    await this.setCustomers(demoCustomers);
    await this.setServices(DEFAULT_SERVICES);

    const services = await this.getServices();
    const today = new Date();
    const demoBookings: Booking[] = [];

    for (let i = 0; i < 8; i++) {
      const bookingDate = new Date(today);
      bookingDate.setDate(today.getDate() + Math.floor(Math.random() * 14) - 3);
      const service = services[Math.floor(Math.random() * services.length)];
      const customer = demoCustomers[Math.floor(Math.random() * demoCustomers.length)];
      const hour = 9 + Math.floor(Math.random() * 7);

      demoBookings.push({
        id: generateId(),
        customerId: customer.id,
        serviceId: service.id,
        date: bookingDate.toISOString().split("T")[0],
        time: `${hour.toString().padStart(2, "0")}:00`,
        status: bookingDate < today ? "completed" : "confirmed",
        totalPrice: service.price,
        notes: "",
        vehicleInfo: ["2022 Tesla Model 3", "2021 BMW X5", "2023 Mercedes C300", "2020 Audi Q7", "2022 Porsche 911"][
          Math.floor(Math.random() * 5)
        ],
        createdAt: new Date(bookingDate.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }

    await this.setBookings(demoBookings);
  },

  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        KEYS.SERVICES,
        KEYS.CUSTOMERS,
        KEYS.BOOKINGS,
        KEYS.AVAILABILITY,
        KEYS.BUSINESS_INFO,
      ]);
    } catch (error) {
      console.error("Error clearing data:", error);
    }
  },

  async getDashboardStats(): Promise<{
    todayRevenue: number;
    weekRevenue: number;
    monthRevenue: number;
    todayBookings: number;
    weekBookings: number;
    upcomingBookings: Booking[];
    capacityPercent: number;
  }> {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekStartStr = weekStart.toISOString().split("T")[0];
    
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthStartStr = monthStart.toISOString().split("T")[0];

    const bookings = await this.getBookings();
    
    const todayBookings = bookings.filter((b) => b.date === todayStr && b.status !== "cancelled");
    const weekBookings = bookings.filter(
      (b) => b.date >= weekStartStr && b.date <= todayStr && b.status !== "cancelled"
    );
    const monthBookings = bookings.filter(
      (b) => b.date >= monthStartStr && b.date <= todayStr && b.status !== "cancelled"
    );

    const upcomingBookings = bookings
      .filter((b) => b.date >= todayStr && b.status !== "cancelled")
      .sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return a.time.localeCompare(b.time);
      })
      .slice(0, 5);

    const availability = await this.getAvailability();
    const todayAvail = availability.find((a) => a.dayOfWeek === today.getDay());
    let capacityPercent = 0;
    
    if (todayAvail?.isActive) {
      const startHour = parseInt(todayAvail.startTime.split(":")[0]);
      const endHour = parseInt(todayAvail.endTime.split(":")[0]);
      const totalSlots = (endHour - startHour) * 2;
      capacityPercent = totalSlots > 0 ? Math.min((todayBookings.length / totalSlots) * 100, 100) : 0;
    }

    return {
      todayRevenue: todayBookings.reduce((sum, b) => sum + b.totalPrice, 0),
      weekRevenue: weekBookings.reduce((sum, b) => sum + b.totalPrice, 0),
      monthRevenue: monthBookings.reduce((sum, b) => sum + b.totalPrice, 0),
      todayBookings: todayBookings.length,
      weekBookings: weekBookings.length,
      upcomingBookings,
      capacityPercent,
    };
  },

  async getRevenueHistory(days: number): Promise<{ date: string; revenue: number }[]> {
    const today = new Date();
    const bookings = await this.getBookings();
    const history: { date: string; revenue: number }[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      
      const dayRevenue = bookings
        .filter((b) => b.date === dateStr && b.status !== "cancelled")
        .reduce((sum, b) => sum + b.totalPrice, 0);
      
      history.push({ date: dateStr, revenue: dayRevenue });
    }

    return history;
  },
};

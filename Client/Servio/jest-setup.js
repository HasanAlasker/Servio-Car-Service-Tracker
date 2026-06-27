// Fix window issues in React Native testing environment
global.window = global.window || {};
global.window.dispatchEvent = global.window.dispatchEvent || jest.fn();

// Helper to mock Zustand stores that handle both selector and no-selector calls
const mockStore = (state) => (fn) => (typeof fn === 'function' ? fn(state) : state);

// Mock Zustand stores
jest.mock('./store/admin/useAdminStore', () => ({
  useAdminStore: mockStore({
    dashboard: { users: 0, shops: 0, appointments: 0, carOwners: 0, shopOwners: 0, activeUsers: 0, deletedUsers: 0, adminUsers: 0, activeShops: 0, deletedShops: 0, shopRequests: 0, reports: 0, suggestions: 0, cars: 0 },
    loadDashbord: jest.fn(),
    loadDashboard: jest.fn(),
  }),
}));

jest.mock('./store/admin/useShopStore', () => ({
  useShopStore: mockStore({
    verifiedShops: [],
    unVerifiedShops: [],
    loadShops: jest.fn(),
  }),
}));

jest.mock('./store/admin/useReportStore', () => ({
  useReportStore: mockStore({
    open: [],
    closed: [],
    loadReports: jest.fn(),
  }),
}));

jest.mock('./store/shopOwner/useBookingsStore', () => ({
  useBookingStore: mockStore({
    callTo: [],
    loadBook: jest.fn(),
    completeApp: jest.fn(),
  }),
}));

// Mock useApi hook
const mockUseApi = jest.fn(() => ({
  error: false,
  loading: false,
  data: [],
  request: jest.fn(),
  message: null,
  status: 200,
  success: true,
}));
jest.mock('./hooks/useApi', () => ({
  __esModule: true,
  default: mockUseApi,
}));

// Mock Contexts
jest.mock('./context/UserContext', () => ({
  UseUser: () => ({
    user: { _id: 'u1', name: 'Test User', role: 'user', phone: '123' },
    token: 'test-token',
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
    editProfile: jest.fn(),
    loadUserData: jest.fn(),
    isShopOwner: false,
    isAdmin: false,
    isUser: true,
    serverAwake: true,
    showPartNote: false,
    hideNote: jest.fn(),
  }),
}));

jest.mock('./context/CarContext', () => ({
  UseCar: () => ({
    cars: [],
    selectedCar: null,
    setCars: jest.fn(),
    setSelectedCar: jest.fn(),
    addNewCar: jest.fn(),
    updateCars: jest.fn(),
    loadCars: jest.fn(),
    loading: false,
  }),
}));

jest.mock('./context/ShopContext', () => ({
  UseShop: () => ({
    shops: [],
    selectedShop: null,
    setShops: jest.fn(),
    setSelectedShop: jest.fn(),
    loadShops: jest.fn(),
  }),
}));

jest.mock('./context/ServiceContext', () => ({
  UseService: () => ({
    services: [],
    loadServices: jest.fn(),
    countDueServices: jest.fn(() => 0),
  }),
}));

jest.mock('./context/AppointmentContext', () => ({
  UseAppointment: () => ({
    appointments: [],
    upcoming: [],
    completed: [],
    loadAppointments: jest.fn(),
    isConfirmedAppointments: jest.fn(() => false),
  }),
}));

jest.mock('./context/ThemeContext', () => ({
  useTheme: () => ({
    theme: {
      colors: { primary: '#000', secondary: '#fff', background: '#fff', text: '#000' },
      blue: '#00f', background: '#fff', g1: '#000', g2: '#000', g3: '#000', g4: '#000', g5: '#000', g6: '#000', g7: '#000',
      always_white: '#fff', post: '#eee', faded: '#ccc', sec_text: '#888', darker_gray: '#444', red: '#f00', gold: '#ffd700', main_text: '#000',
    },
    isDark: false,
    toggleTheme: jest.fn(),
  }),
}));

jest.mock('./hooks/useThemedStyles', () => ({
  __esModule: true,
  default: (stylesFn) => stylesFn({
    colors: { primary: '#000', secondary: '#fff', background: '#fff', text: '#000' },
    blue: '#00f', background: '#fff', red: '#f00', main_text: '#000', sec_text: '#888'
  }),
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const { View, Text, Image, ScrollView } = require('react-native');
  const mockAnimatedComponent = (Component) => ({ children, ...props }) => React.createElement(Component, props, children);
  
  return {
    default: { call: jest.fn(), createAnimatedComponent: (c) => c },
    useSharedValue: (v) => ({ value: v }),
    useAnimatedStyle: () => ({}),
    useAnimatedProps: () => ({}),
    useDerivedValue: (v) => ({ value: v() }),
    useAnimatedScrollHandler: () => () => {},
    useAnimatedGestureHandler: () => () => {},
    useAnimatedRef: () => ({ current: null }),
    withTiming: (v) => v,
    withSpring: (v) => v,
    withDelay: (t, v) => v,
    withSequence: (...args) => args[0],
    withRepeat: (v) => v,
    cancelAnimation: jest.fn(),
    runOnJS: (fn) => fn,
    runOnUI: (fn) => fn,
    makeMutable: (v) => ({ value: v }),
    View: mockAnimatedComponent(View),
    Text: mockAnimatedComponent(Text),
    ScrollView: mockAnimatedComponent(ScrollView),
    Image: mockAnimatedComponent(Image),
    createAnimatedComponent: (c) => c,
    interpolate: jest.fn(),
    Extrapolate: { CLAMP: 'clamp' },
    LinearTransition: {},
    SlideInDown: {},
    FadeIn: {},
    FadeOut: {},
  };
});

jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

jest.mock('lottie-react-native', () => 'LottieView');
jest.mock('@lottiefiles/dotlottie-react', () => 'DotLottieView');

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { View } = require('react-native');
  const MockIcon = (props) => React.createElement(View, props);
  MockIcon.loadFont = () => Promise.resolve();
  MockIcon.font = {};
  MockIcon.button = MockIcon;
  return new Proxy({}, { get: () => MockIcon });
});

jest.mock('expo-font');
jest.mock('expo-asset');
jest.mock('expo-linear-gradient', () => ({ LinearGradient: ({ children }) => children }));
jest.mock('react-native-keyboard-aware-scroll-view', () => ({ KeyboardAwareScrollView: ({ children }) => children }));
jest.mock('expo-image-picker', () => ({ launchImageLibraryAsync: jest.fn(), requestMediaLibraryPermissionsAsync: jest.fn() }));
jest.mock('expo-constants', () => ({ manifest: {}, expoConfig: { extra: { eas: { projectId: 'test-id' } } } }));
jest.mock('expo-device', () => ({ isDevice: true }));
jest.mock('@react-native-community/netinfo', () => ({
  useNetInfo: () => ({ isConnected: true, isInternetReachable: true, type: 'wifi' }),
  addEventListener: jest.fn(),
  fetch: jest.fn(),
}));
jest.mock('react-native-gifted-charts', () => ({ LineChart: () => null, BarChart: () => null, PieChart: () => null }));
jest.mock('react-native-alert-queue', () => ({
  alert: { confirm: jest.fn(async () => true), alert: jest.fn() },
  AlertQueue: { alert: jest.fn(), confirm: jest.fn(async () => true) },
}));
jest.mock('react-native-toast-notifications', () => ({ useToast: () => ({ show: jest.fn(), hide: jest.fn() }) }));

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  const mockUseRoute = jest.fn(() => ({ params: {}, name: 'Test' }));
  const mockUseNavigation = jest.fn(() => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    setOptions: jest.fn(),
    addListener: jest.fn(() => () => {}),
    reset: jest.fn(),
  }));
  return { ...actualNav, useNavigation: mockUseNavigation, useRoute: mockUseRoute, useIsFocused: () => true, useFocusEffect: jest.fn() };
});

// Mock complex components globally to save memory
jest.mock('./components/general/Navbar', () => () => null);
jest.mock('./components/general/SafeScreen', () => {
  const React = require('react');
  const { View } = require('react-native');
  return ({ children }) => React.createElement(View, { testID: 'SafeScreen' }, children);
});
jest.mock('./components/general/ScrollScreen', () => {
  const React = require('react');
  const { View } = require('react-native');
  return ({ children }) => React.createElement(View, { testID: 'ScrollScreen' }, children);
});
jest.mock('./components/general/KeyboardScrollScreen', () => {
  const React = require('react');
  const { View } = require('react-native');
  return ({ children }) => React.createElement(View, { testID: 'KeyboardScrollScreen' }, children);
});
jest.mock('./components/general/OfflineModal', () => () => null);
jest.mock('./components/general/AdminDash', () => () => null);
jest.mock('./components/charts/PieChartComp', () => () => null);
jest.mock('./components/loading/LoadingSkeleton', () => () => null);
jest.mock('./components/general/GapContainer', () => {
  const React = require('react');
  const { View } = require('react-native');
  return ({ children }) => React.createElement(View, { testID: 'GapContainer' }, children);
});
jest.mock('./components/text/SText', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return ({ children, style }) => React.createElement(Text, { style }, children);
});

jest.mock('./config/AppText', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return ({ children, style }) => React.createElement(Text, { style }, children);
});

jest.mock('./components/general/TabNav', () => {
  const React = require('react');
  const { View, Text, Pressable } = require('react-native');
  return function MockTabNav({ one, two, onTabChange }) {
    return (
      <View>
        <Pressable onPress={() => onTabChange(1)}><Text>{one}</Text></Pressable>
        <Pressable onPress={() => onTabChange(2)}><Text>{two}</Text></Pressable>
      </View>
    );
  };
});

jest.mock('./components/general/SearchBar', () => () => null);

// Mock form components to save memory
jest.mock('./components/general/InputBox', () => {
  const React = require('react');
  const { TextInput, View, Text } = require('react-native');
  return (props) => (
    <View>
      <Text>{props.label}</Text>
      <TextInput {...props} />
    </View>
  );
});

jest.mock('./components/form/FormikDatePicker', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  const { useFormikContext } = require('formik');
  return function MockDatePicker({ name, placeholder }) {
    const { errors, touched } = useFormikContext();
    return (
      <View>
        <Text>{placeholder}</Text>
        {errors[name] && touched[name] && <Text>{errors[name]}</Text>}
      </View>
    );
  };
});

jest.mock('./components/cards/AppSummary', () => 'AppSummary');
jest.mock('./components/cards/CarOptionsCard', () => 'CarOptionsCard');
jest.mock('./components/cards/UserCard', () => 'UserCard');
jest.mock('./components/cards/ShopCard', () => 'ShopCard');

jest.mock('./components/cards/PartCard', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return function MockPartCard({ part }) {
    return (
      <View>
        <Text>{part?.name}</Text>
      </View>
    );
  };
});

jest.mock('./components/cards/CarCard', () => {
  const React = require('react');
  const { Text, Pressable } = require('react-native');
  const { useNavigation } = require('@react-navigation/native');
  return function MockCarCard(props) {
    const navigation = useNavigation();
    const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
    const handlePress = () => {
      if (props.onPress) {
        props.onPress(props.id);
      } else {
        navigation.navigate("CarParts", props);
      }
    };
    return (
      <Pressable onPress={handlePress}>
        <Text>{`${cap(props.make)} ${cap(props.name)}`}</Text>
      </Pressable>
    );
  };
});

jest.mock('./components/cards/AppointmentCard', () => {
  const React = require('react');
  const { View, Text, Pressable } = require('react-native');
  return function MockAppointmentCard({ car, customer, shop, status, onReject, id }) {
    const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
    return (
      <View>
        <Text>{`${cap(car?.make)} ${cap(car?.name)}`}</Text>
        <Text>{customer?.name}</Text>
        <Text>{shop?.name}</Text>
        <Text>{status}</Text>
        {onReject && <Pressable onPress={() => onReject(id)}><Text>Reject</Text></Pressable>}
      </View>
    );
  };
});

global.console = { ...console, error: jest.fn(), warn: jest.fn(), log: jest.fn() };

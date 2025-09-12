import React from 'react';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error);
    console.error('Error info:', errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-500">
              <h1 className="text-2xl font-bold text-red-600 mb-4">
                🚨 Component Error Detected!
              </h1>
              
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Error Details:</h2>
                <div className="bg-red-100 border border-red-300 rounded p-4">
                  <pre className="text-red-800 text-sm overflow-auto">
                    {this.state.error && this.state.error.toString()}
                  </pre>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Component Stack:</h2>
                <div className="bg-gray-100 border border-gray-300 rounded p-4">
                  <pre className="text-gray-800 text-xs overflow-auto whitespace-pre-wrap">
                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                  </pre>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Common Fix Solutions:</h3>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Check for undefined variables or props</li>
                  <li>• Verify all imports are correct</li>
                  <li>• Make sure all required dependencies are available</li>
                  <li>• Check for missing CSS classes or styling issues</li>
                  <li>• Verify component props are passed correctly</li>
                </ul>
              </div>

              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Test Dashboard Component
const TestDashboard = () => {
  const [activeTab, setActiveTab] = React.useState('dashboard');
  
  // Sample data for testing
  const [rooms] = React.useState([
    {
      id: 1,
      name: 'Shiitake Growing Room',
      temperature: 23,
      humidity: 83,
      status: 'optimal'
    },
    {
      id: 2,
      name: 'Oyster Growing Room', 
      temperature: 25,
      humidity: 78,
      status: 'warning'
    }
  ]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation Tabs */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'dashboard'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('iot')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'iot'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                IoT Monitoring
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Profile
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <ErrorBoundary>
            {activeTab === 'dashboard' && <DashboardComponent />}
          </ErrorBoundary>
          
          <ErrorBoundary>
            {activeTab === 'iot' && <IoTComponent rooms={rooms} />}
          </ErrorBoundary>
          
          <ErrorBoundary>
            {activeTab === 'profile' && <ProfileComponent />}
          </ErrorBoundary>
        </div>
      </div>
    </ErrorBoundary>
  );
};

// Dashboard Component
const DashboardComponent = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-blue-600">156</div>
          <div className="text-gray-600">Total Orders</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-green-600">20</div>
          <div className="text-gray-600">Total Rooms</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-purple-600">285 kg</div>
          <div className="text-gray-600">Mushrooms Produced</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Room 1: Temperature optimal</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Room 2: Humidity warning</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">New order received</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// IoT Component  
const IoTComponent = ({ rooms = [] }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">IoT Monitoring</h1>
      
      {/* Room Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map(room => (
          <div key={room.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">{room.name}</h3>
              <span className={`px-2 py-1 text-xs rounded ${
                room.status === 'optimal' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {room.status}
              </span>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm">
                  <span>Temperature</span>
                  <span>{room.temperature}°C</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${(room.temperature / 30) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm">
                  <span>Humidity</span>
                  <span>{room.humidity}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${room.humidity}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {rooms.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No rooms available</p>
        </div>
      )}
    </div>
  );
};

// Profile Component
const ProfileComponent = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
            DR
          </div>
          <div>
            <h2 className="text-xl font-semibold">Delicious Recipe</h2>
            <p className="text-gray-600">Admin User</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input 
              type="email" 
              defaultValue="admin@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input 
              type="tel" 
              defaultValue="+91 9876543210"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Admin</option>
              <option>User</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input 
              type="text" 
              defaultValue="Chennai, India"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestDashboard;
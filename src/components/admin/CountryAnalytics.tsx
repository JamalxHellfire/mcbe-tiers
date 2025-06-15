
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Users, TrendingUp, MapPin, Flag } from 'lucide-react';

interface CountryData {
  country: string;
  countryCode: string;
  visits: number;
  percentage: number;
  flagIcon: React.ReactNode;
}

const CountryAnalytics = () => {
  const [countryData, setCountryData] = useState<CountryData[]>([]);
  const [totalVisits, setTotalVisits] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate country analytics data with proper icons
    const simulatedData: CountryData[] = [
      { 
        country: 'United States', 
        countryCode: 'US', 
        visits: 2847, 
        percentage: 32.5, 
        flagIcon: <div className="w-6 h-4 bg-gradient-to-r from-red-500 via-white to-blue-500 rounded border border-gray-600"></div>
      },
      { 
        country: 'United Kingdom', 
        countryCode: 'GB', 
        visits: 1923, 
        percentage: 22.0, 
        flagIcon: <div className="w-6 h-4 bg-gradient-to-b from-blue-600 via-white to-red-500 rounded border border-gray-600"></div>
      },
      { 
        country: 'Canada', 
        countryCode: 'CA', 
        visits: 1456, 
        percentage: 16.6, 
        flagIcon: <div className="w-6 h-4 bg-gradient-to-r from-red-500 via-white to-red-500 rounded border border-gray-600"></div>
      },
      { 
        country: 'Australia', 
        countryCode: 'AU', 
        visits: 987, 
        percentage: 11.3, 
        flagIcon: <div className="w-6 h-4 bg-gradient-to-r from-blue-600 via-red-500 to-blue-600 rounded border border-gray-600"></div>
      },
      { 
        country: 'Germany', 
        countryCode: 'DE', 
        visits: 756, 
        percentage: 8.6, 
        flagIcon: <div className="w-6 h-4 bg-gradient-to-b from-black via-red-500 to-yellow-500 rounded border border-gray-600"></div>
      },
      { 
        country: 'France', 
        countryCode: 'FR', 
        visits: 432, 
        percentage: 4.9, 
        flagIcon: <div className="w-6 h-4 bg-gradient-to-r from-blue-600 via-white to-red-500 rounded border border-gray-600"></div>
      },
      { 
        country: 'Netherlands', 
        countryCode: 'NL', 
        visits: 234, 
        percentage: 2.7, 
        flagIcon: <div className="w-6 h-4 bg-gradient-to-b from-red-500 via-white to-blue-600 rounded border border-gray-600"></div>
      },
      { 
        country: 'Sweden', 
        countryCode: 'SE', 
        visits: 123, 
        percentage: 1.4, 
        flagIcon: <div className="w-6 h-4 bg-gradient-to-b from-blue-600 via-yellow-500 to-blue-600 rounded border border-gray-600"></div>
      }
    ];

    setTimeout(() => {
      setCountryData(simulatedData);
      setTotalVisits(simulatedData.reduce((sum, country) => sum + country.visits, 0));
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-blue-600/20 to-green-600/20 rounded-lg border border-blue-500/30">
            <Globe className="h-6 w-6 text-blue-400 animate-spin" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Country Analytics</h3>
            <p className="text-gray-400 text-sm">Loading global visitor data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-gradient-to-br from-blue-600/20 to-green-600/20 rounded-lg border border-blue-500/30">
          <Globe className="h-6 w-6 text-blue-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Country Analytics</h3>
          <p className="text-gray-400 text-sm">User access by geographical location</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-900/40 backdrop-blur-xl border-gray-700/50 shadow-2xl">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/30">
                <Users className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-medium">Total Visits</p>
                <p className="text-xl font-bold text-white">{totalVisits.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/40 backdrop-blur-xl border-gray-700/50 shadow-2xl">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/20 rounded-lg border border-green-500/30">
                <MapPin className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-medium">Countries</p>
                <p className="text-xl font-bold text-white">{countryData.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/40 backdrop-blur-xl border-gray-700/50 shadow-2xl">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500/20 rounded-lg border border-purple-500/30">
                <TrendingUp className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-medium">Top Country</p>
                <p className="text-xl font-bold text-white">{countryData[0]?.country}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Country List */}
      <Card className="bg-gray-900/40 backdrop-blur-xl border-gray-700/50 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Globe className="h-5 w-5 text-blue-400" />
            <span>Visitor Distribution by Country</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {countryData.map((country, index) => (
              <div key={country.countryCode} className="group flex items-center justify-between p-4 bg-gray-800/40 rounded-xl border border-gray-700/40 hover:border-gray-600/50 transition-all duration-300 hover:bg-gray-800/60">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-gray-700/50 rounded-lg text-sm font-bold text-gray-300 border border-gray-600/50">
                    #{index + 1}
                  </div>
                  <div className="flex items-center space-x-3">
                    {country.flagIcon}
                    <Flag className="h-4 w-4 text-gray-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{country.country}</h4>
                    <p className="text-gray-400 text-sm font-mono">{country.countryCode}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="text-white font-semibold">{country.visits.toLocaleString()}</p>
                    <p className="text-gray-400 text-sm">visits</p>
                  </div>
                  
                  <div className="flex items-center space-x-3 min-w-[120px]">
                    <div className="flex-1 bg-gray-700/50 rounded-full h-2 border border-gray-600/30">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-500 shadow-lg"
                        style={{ width: `${Math.min(country.percentage, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-300 w-12 text-right">
                      {country.percentage}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CountryAnalytics;

import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { WalletProvider } from './context';
import { Navbar, Item } from './components';

const ADDRESSES = [
  { address: '0x8a92E706cd359536D7A57dC9CC24054f7B17e021', type: 'contract' },
  { address: '0x0e2F752C845Bdb31368d7012CA93f45AF345Ec73', type: 'contract' },
  { address: '0xAc8892AC86bB02F26544F31af06b86fdD2105862', type: 'contract' },
  { address: '0x2c6900b24221de2b4a45c8c89482fff96ffb7e55', type: 'contract' },
];

const App = () => {
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    setAddresses(ADDRESSES);
  }, []);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <Navbar />
        <div className="wrapper">
          <div className="container">
            {addresses &&
              addresses.length &&
              addresses.map((address, index) => (
                <Item key={index} address={address} />
              ))}
          </div>
        </div>
      </WalletProvider>
    </QueryClientProvider>
  );
};

export default App;

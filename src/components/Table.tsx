import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useQuery, gql } from '@apollo/client';
import { ethers } from 'ethers';
import './Table.css'; // Import the CSS file
import { getAddress } from 'viem';

// Define the GraphQL query
const GET_TOP_AFFILIATES = gql`
  {
    affiliateEvents(first: 10, orderBy: amount, orderDirection: desc) {
      affiliate
      amount
    }
  }
`;

interface AffiliateEvent {
  affiliate: string;
  amount: number;
}

interface AffiliateEventsData {
  affiliateEvents: AffiliateEvent[];
}

interface TableProps {
  etherscanDomain: string;
  priceInWei: number;
  connectedAccount: string;
}

const Table: React.FC<TableProps> = ({ etherscanDomain, priceInWei, connectedAccount }) => {
  const [ensMap, setEnsMap] = useState<Record<string, string>>({});
  const fetchedENS = useRef<Set<string>>(new Set());

  // Memoize the provider so that it doesn't change on every render
  const provider = useMemo(() => new ethers.JsonRpcProvider('https://eth-mainnet.g.alchemy.com/v2/7VRG5CtXPdmq6p65GXf2uz6g_8Xb2oPz'), []);

  const { loading, error, data } = useQuery<AffiliateEventsData>(GET_TOP_AFFILIATES);

  useEffect(() => {
    if (data?.affiliateEvents) {
      const fetchENSNames = async () => {
        const ensNames: Record<string, string> = {};
        for (const { affiliate } of data.affiliateEvents) {
          const address = getAddress(affiliate);
          if (!fetchedENS.current.has(address)) {  // Check if ENS has been fetched before
            const ensName = await provider.lookupAddress(address);
            ensNames[address] = ensName || getAddressAndFormat(address);
            fetchedENS.current.add(address);  // Mark this address as fetched
          }
        }
        setEnsMap(prev => ({ ...prev, ...ensNames }));
      };

      fetchENSNames();
    }
  }, [data, provider]); // Remove ensMap from dependencies

  function openAffiliate(affiliate: string) {
    window.open(`https://${etherscanDomain}/address/${affiliate}`, '_blank');
  }

  function getEthAmount(amount: number) {
    return ((priceInWei / 1e18) * amount).toFixed(2);
  }

  function getAddressAndFormat(affiliate: string) {
    const formattedAddress = getAddress(affiliate);
    return formattedAddress.slice(0, 6) + '...' + formattedAddress.slice(-4);
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div className="table-container">
      <h2>Top 10 Affiliates</h2>
      <table className="affiliate-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Affiliate</th>
            <th>Amount</th>
            <th>Reward</th>
          </tr>
        </thead>
        <tbody>
          {data?.affiliateEvents.map(({ affiliate, amount }, index) => (
            <tr key={affiliate} onClick={() => openAffiliate(affiliate)}>
              <td>{index + 1}</td>
              <td>{ensMap[getAddress(affiliate)] || getAddressAndFormat(affiliate)}</td>
              <td>{amount} referrals</td>
              <td>{getEthAmount(amount)} eth</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;

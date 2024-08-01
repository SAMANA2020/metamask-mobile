import { toChecksumAddress } from 'ethereumjs-util';
import { useSelector } from 'react-redux';

import { selectChainId } from '../../selectors/networkController';
import { selectInternalAccounts } from '../../selectors/accountsController';
import { toLowerCaseEquals } from '../../util/general';
import { AddressBookEntry } from '@metamask/address-book-controller';
import { selectAddressBook } from '../../selectors/addressBookController';

type AccountInfo = Pick<AddressBookEntry, 'name' | 'address'>;

const useExistingAddress = (address?: string): AccountInfo | undefined => {
  const chainId = useSelector(selectChainId);

  const addressBook = useSelector(selectAddressBook);
  const internalAccounts = useSelector(selectInternalAccounts);

  if (!address) return;

  const networkAddressBook = addressBook[chainId] || {};
  const checksummedAddress = toChecksumAddress(address);

  const matchingAddressBookEntry: AddressBookEntry | undefined =
    networkAddressBook?.[checksummedAddress];

  if (matchingAddressBookEntry) {
    return {
      name: matchingAddressBookEntry.name,
      address: matchingAddressBookEntry.address,
    };
  }

  const accountWithMatchingAddress = internalAccounts.find((account) =>
    toLowerCaseEquals(account.address, address),
  );

  if (accountWithMatchingAddress) {
    return {
      address: accountWithMatchingAddress.address,
      name: accountWithMatchingAddress.metadata.name,
    };
  }

  return undefined;
};

export default useExistingAddress;

// Update the ServiceReceiptHeader interface
interface ServiceReceiptHeader {
  serialNumber: string;
  warehouseNumber: string;
  serviceProviderName: string;
  serviceProviderCode: string;
  wbs: string;
  serviceDate: string;
  storekeeperName: string;
  helperName: string; // Add new field
}

const getInitialHeaderData = (): ServiceReceiptHeader => ({
  serialNumber: generateSerialNumber(),
  warehouseNumber: '',
  serviceProviderName: '',
  serviceProviderCode: '',
  wbs: '',
  serviceDate: '',
  storekeeperName: '',
  helperName: '' // Initialize new field
});

// Rest of the file remains the same...
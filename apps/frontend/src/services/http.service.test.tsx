import { CLNService, HttpService } from './http.service';
import { SCROLL_PAGE_SIZE } from '../utilities/constants';
import { spyOnIsCompatibleVersion, spyOnListOffersSQL, spyOnListOffersSQLWithoutDesc } from '../utilities/test-utilities/mockUtilities';
import { createMockStore } from '../utilities/test-utilities/mockStore';
import { mockNodeInfo, mockRootStoreData } from '../utilities/test-utilities/mockData';

describe('CLNService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listOffers', () => {
    it('should use ListOffersSQL when version is compatible (>= 26.04)', async () => {
      const mockStore = createMockStore('/', {
        root: { ...mockRootStoreData, nodeInfo: { ...mockNodeInfo, version: '26.04' } },
      });
      const isCompatibleVersionSpy = spyOnIsCompatibleVersion();
      const listOffersSQLSpy = spyOnListOffersSQL('desc');
      const listOffersSQLWithoutDescSpy = spyOnListOffersSQLWithoutDesc('no desc');
      jest.spyOn(HttpService, 'clnCall').mockResolvedValue({ rows: [] });
      await CLNService.listOffers(0, mockStore);

      expect(isCompatibleVersionSpy).toHaveBeenCalledWith('26.04', '26.04');
      expect(listOffersSQLSpy).toHaveBeenCalledWith(SCROLL_PAGE_SIZE, 0);
      expect(listOffersSQLWithoutDescSpy).not.toHaveBeenCalled();
    });

    it('should use ListOffersSQLWithoutDesc when version is not compatible (< 26.04)', async () => {
      const mockStore = createMockStore('/', {
        root: { ...mockRootStoreData, nodeInfo: { ...mockNodeInfo, version: '25.12' } },
      });
      const isCompatibleVersionSpy = spyOnIsCompatibleVersion();
      const listOffersSQLSpy = spyOnListOffersSQL('desc');
      const listOffersSQLWithoutDescSpy = spyOnListOffersSQLWithoutDesc('no desc');
      jest.spyOn(HttpService, 'clnCall').mockResolvedValue({ rows: [] });

      await CLNService.listOffers(0, mockStore);

      expect(isCompatibleVersionSpy).toHaveBeenCalledWith('25.12', '26.04');
      expect(listOffersSQLWithoutDescSpy).toHaveBeenCalledWith(SCROLL_PAGE_SIZE, 0);
      expect(listOffersSQLSpy).not.toHaveBeenCalled();
    });

    it('should fallback to ListOffersSQLWithoutDesc when query fails with "no such column: description"', async () => {
      const mockStore = createMockStore('/', {
        root: { ...mockRootStoreData, nodeInfo: { ...mockNodeInfo, version: '26.04' } },
      });
      const isCompatibleVersionSpy = spyOnIsCompatibleVersion();
      const listOffersSQLSpy = spyOnListOffersSQL('desc');
      const listOffersSQLWithoutDescSpy = spyOnListOffersSQLWithoutDesc('no desc');

      const clnCallSpy = jest
        .spyOn(HttpService, 'clnCall')
        // First call fails (new schema not supported)
        .mockRejectedValueOnce(new Error('no such column: description'))
        // Second call succeeds (fallback query)
        .mockResolvedValueOnce({ rows: [] });
      const result = await CLNService.listOffers(0, mockStore);
      
      expect(clnCallSpy).toHaveBeenCalledTimes(2);
      expect(isCompatibleVersionSpy).toHaveBeenCalledWith('26.04', '26.04');
      expect(listOffersSQLSpy).toHaveBeenCalledWith(SCROLL_PAGE_SIZE, 0);
      expect(listOffersSQLWithoutDescSpy).toHaveBeenCalledWith(SCROLL_PAGE_SIZE, 0);
      expect(result.offers).toEqual([]);
    });

    it('should handle empty version gracefully', async () => {
      const mockStore = createMockStore('/', {
        root: { ...mockRootStoreData, nodeInfo: { ...mockNodeInfo, version: '' } },
      });
      const isCompatibleVersionSpy = spyOnIsCompatibleVersion();
      const listOffersSQLSpy = spyOnListOffersSQL('desc');
      const listOffersSQLWithoutDescSpy = spyOnListOffersSQLWithoutDesc('no desc');
      jest.spyOn(HttpService, 'clnCall').mockResolvedValue({ rows: [{ offer_id: '456' }] });

      const result = await CLNService.listOffers(0, mockStore);

      expect(isCompatibleVersionSpy).toHaveBeenCalledWith('', '26.04');
      expect(listOffersSQLWithoutDescSpy).toHaveBeenCalledWith(SCROLL_PAGE_SIZE, 0);
      expect(listOffersSQLSpy).not.toHaveBeenCalled();
      expect(result.offers).toBeDefined();
    });

    it('should return empty offers array when rows is undefined', async () => {
      const mockStore = createMockStore('/', {
        root: { ...mockRootStoreData, nodeInfo: { ...mockNodeInfo, version: '25.12' } },
      });
      const isCompatibleVersionSpy = spyOnIsCompatibleVersion();
      const listOffersSQLSpy = spyOnListOffersSQL('desc');
      const listOffersSQLWithoutDescSpy = spyOnListOffersSQLWithoutDesc('no desc');
      jest.spyOn(HttpService, 'clnCall').mockResolvedValue({});
      const result = await CLNService.listOffers(0, mockStore);

      expect(isCompatibleVersionSpy).toHaveBeenCalledWith('25.12', '26.04');
      expect(listOffersSQLWithoutDescSpy).toHaveBeenCalledWith(SCROLL_PAGE_SIZE, 0);
      expect(listOffersSQLSpy).not.toHaveBeenCalled();
      expect(result.offers).toEqual([]);
    });
  });
});

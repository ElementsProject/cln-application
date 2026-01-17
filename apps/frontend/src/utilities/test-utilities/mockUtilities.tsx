import * as DataFormatters from '../../utilities/data-formatters';
import * as ClnSql from '../../utilities/cln-sql';

export const spyOnIsCompatibleVersion = () => {
  const realImpl = DataFormatters.isCompatibleVersion;

  return jest
    .spyOn(DataFormatters, 'isCompatibleVersion')
    .mockImplementation((currentVersion: string, checkVersion: string) =>
      realImpl(currentVersion, checkVersion)
    );
};

export const spyOnListOffersSQL = (returnValue = 'SQL_WITH_DESC') =>
  jest.spyOn(ClnSql, 'ListOffersSQL').mockReturnValue(returnValue);

export const spyOnListOffersSQLWithoutDesc = (returnValue = 'SQL_WITHOUT_DESC') =>
  jest.spyOn(ClnSql, 'ListOffersSQLWithoutDesc').mockReturnValue(returnValue);

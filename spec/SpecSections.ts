export interface ISpecSections {
    SectionID: string;
    Name: string;
    DisplayOrder: string;
    Volume: string;
    NotReqXML: string;
    FIXMLFileName: string;
    Description: string;
}

export const SECTIONS: ISpecSections[] = [
    {
        SectionID: 'Session',
        Name: 'Session',
        DisplayOrder: '0',
        Volume: 'FIXT.1.1',
        NotReqXML: '1',
        FIXMLFileName: 'session',
        Description:
            'Session level messages to establish and control a FIX session',
    },
    {
        SectionID: 'PreTrade',
        Name: 'PreTrade',
        DisplayOrder: '1',
        Volume: '3',
        NotReqXML: '0',
        FIXMLFileName: 'pretrade',
        Description:
            'Pre trade messages including reference data, market data, quoting, news and email, indication of interest',
    },
    {
        SectionID: 'Trade',
        Name: 'Trade',
        DisplayOrder: '2',
        Volume: '4',
        NotReqXML: '0',
        FIXMLFileName: 'trade',
        Description: 'Order handling and execution messages',
    },
    {
        SectionID: 'PostTrade',
        Name: 'PostTrade',
        DisplayOrder: '3',
        Volume: '5',
        NotReqXML: '0',
        FIXMLFileName: 'posttrade',
        Description:
            'Post trade messages including trade reporting, allocation, collateral, confirmation, position mantemenance, registration instruction, and settlement instructions',
    },
    {
        SectionID: 'Infrastructure',
        Name: 'Infrastructure',
        DisplayOrder: '4',
        Volume: '1',
        NotReqXML: '0',
        FIXMLFileName: 'infrastructure',
        Description:
            'Infrastructure messages for application sequencing, business reject, network and user management',
    },
];

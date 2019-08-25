export const testMessages = [
    {
        description: 'NewOrderSingle',
        detail: 'New Order Single - BUY 100 CVS MKT DAY',
        fix:
            '8=FIX.4.2^A 9=146^A 35=D^A 34=4^A 49=ABC_DEFG01^A 52=20090323-15:40:29^A 56=CCG^A 115=XYZ^A 11=NF 0542/03232009^A 54=1^A 38=100^A 55=CVS^A 40=1^A 59=0^A 47=A^A 60=20090323-15:40:29^A 21=1^A 207=N^A 10=139^A ',
        checksumValid: false,
        bodyLengthValid: true,
    },
    {
        description: 'ExecutionReport',
        detail: 'Order Acknowledgement',
        fix:
            '8=FIX.4.2^A 9=227^A 35=8^A 128=XYZ^A 34=4^A 49=CCG^A 56=ABC_DEFG01^A 52=20090323-15:40:35^A 55=CVS^A 37=NF 0542/03232009^A 11=NF 0542/03232009^A 17=0^A 20=0^A 39=0^A 150=0^A 54=1^A 38=100^A 40=1^A 59=0^A 31=0^A 32=0^A 14=0^A 6=0^A 151=100^A 60=20090323-15:40:30^A 58=New order^A 30=N^A 207=N^A 47=A^A 10=205^A ',
        checksumValid: true,
        bodyLengthValid: true,
    },
    {
        description: 'NewOrderSingle',
        detail:
            'Closing Offset (New Order Single) - SL 1000 RRC LMT @55.36 DAY',
        fix:
            '8=FIX.4.2^A 9=157^A 35=D^A 34=124^A 49=ABC_DEFG04^A 52=20100208-18:51:42^A 56=CCG^A 115=XYZ^A 11=NF 0015/02082010^A 54=2^A 38=1000^A 55=RRC^A 40=2^A 44=55.36^A 59=0^A 1=ABC123ZYX^A 21=1^A 207=N^A 47=A^A 9487=CO^A 10=050^A ',
        checksumValid: false,
        bodyLengthValid: true,
    },
    {
        description: 'ExecutionReport',
        detail: 'Closing Offset (Order Acknowledgement)',
        fix:
            '8=FIX.4.2^A 9=254^A 35=8^A 128=XYZ^A 34=124^A 49=CCG^A 56=ABC_DEFG04^A 52=20100208-18:51:42^A 55=RRC^A 37=NF 0015/02082010^A 11=NF 0015/02082010^A 17=0^A 20=0^A 39=0^A 150=0^A 54=2^A 38=1000^A 40=2^A 44=55.3600^A 59=0^A 31=0^A 32=0^A 14=0^A 6=0^A 151=1000^A 60=20100208-18:51:42^A 58=New order^A 30=N^A 1=ABC123ZYX^A 207=N^A 47=A^A 10=037^A ',
        checksumValid: false,
        bodyLengthValid: true,
    },
    {
        description: 'NewOrderSingle',
        detail: 'MatchPoint (New Order Single) - SL 1000 MMM MKT DAY',
        fix:
            '8=FIX.4.2^A 9=154^A 35=D^A 34=11^A 49=ABC_DEFG04^A 52=20091216-17:23:52^A 56=CCG^A 57=ARCA^A 115=XYZ^A 128=MP^A 11=NF 0921/12162009^A 54=2^A 38=1000^A 55=MMM^A 40=1^A 59=0^A 1=ABC123ZYX^A 21=1^A 207=N^A 47=A^A 10=035^A ',
        checksumValid: true,
        bodyLengthValid: true,
    },
    {
        description: 'ExecutionReport',
        detail: 'MatchPoint (Order Acknowledgement)',
        fix:
            '8=FIX.4.2^A 9=235^A 35=8^A 50=ARCA^A 128=XYZ^A 34=11^A 49=CCG^A 56=ABC_DEFG04^A 52=20091216-17:23:51^A 55=MMM^A 37=0000002^A 11=NF 0921/12162009^A 17=1000002^A 20=0^A 39=0^A 150=0^A 54=2^A 38=1000^A 40=1^A 59=0^A 31=0^A 32=0^A 14=0^A 6=0^A 151=1000^A 60=20091216-17:23:52^A 58=New order^A 207=N^A 9570=N/MP^A 10=051^A ',
        checksumValid: false,
        bodyLengthValid: true,
    },
    {
        description: 'NewOrderSingle',
        detail: 'Sub-Penny (New Order Single) - BUY 1000 VOD LMT @.995 DAY',
        fix:
            '8=FIX.4.2^A 9=148^A 35=D^A 34=215^A 49=ABC_DEFG04^A 52=20100208-19:36:45^A 56=CCG^A 115=XYZ^A 11=NF 0016/02082010^A 54=1^A 38=1000^A 55=VOD^A 40=2^A 44=.995^A 59=0^A 1=ABC123ZYX^A 21=1^A 207=N^A 47=A^A 10=100^A ',
        checksumValid: false,
        bodyLengthValid: true,
    },
    {
        description: 'ExecutionReport',
        detail: 'Sub-Penny (Order Acknowledgement)',
        fix:
            '8=FIX.4.2^A 9=253^A 35=8^A 128=XYZ^A 34=215^A 49=CCG^A 56=ABC_DEFG04^A 52=20100208-19:36:45^A 55=VOD^A 37=NF 0016/02082010^A 11=NF 0016/02082010^A 17=0^A 20=0^A 39=0^A 150=0^A 54=1^A 38=1000^A 40=2^A 44=0.9950^A 59=0^A 31=0^A 32=0^A 14=0^A 6=0^A 151=1000^A 60=20100208-19:36:45^A 58=New order^A 30=A^A 1=ABC123ZYX^A 207=A^A 47=A^A 10=240^A ',
        checksumValid: false,
        bodyLengthValid: true,
    },
    {
        description: 'Logon',
        detail: '',
        fix:
            '8=FIX.4.2|9=76|35=A|34=702|49=ABC|52=20100130-10:52:40.663|56=XYZ|95=4|96=1234|98=0|108=60|10=134|',
        checksumValid: true,
        bodyLengthValid: true,
    },
    {
        description: 'Logon',
        detail: '',
        fix:
            '8=FIX.4.2|9=59|35=A|49=XYZ|56=ABC|34=710|52=20100130-10:52:36|98=0|108=60|10=103|',
        checksumValid: true,
        bodyLengthValid: true,
    },
    {
        description: 'Heartbeat',
        detail: '',
        fix:
            '8=FIX.4.2|9=51|35=0|34=703|49=ABC|52=20100130-10:53:40.830|56=XYZ|10=249|',
        checksumValid: true,
        bodyLengthValid: true,
    },
    {
        description: 'Heartbeat',
        detail: '',
        fix:
            '8=FIX.4.2|9=47|35=0|49=XYZ|56=ABC|34=711|52=20100130-10:53:36|10=057|',
        checksumValid: true,
        bodyLengthValid: true,
    },
    {
        description: 'ExecutionReport',
        detail: '',
        fix:
            '8=FIX.4.2|9=266|35=8|49=ABC|56=XYZ|50=AZ12|57=NA|34=833|52=20100130-08:00:51.992|55=GLD|48=PL11YA|167=FUT|207=LIFFE|1=AA1|37=ABC1|17=INDNTHDOG|58=Fill|200=201009|205=13|32=25|151=0|14=25|54=2|40=2|77=O|59=0|150=2|20=0|39=2|442=1|44=99.06|38=25|31=99.06|6=99.06|60=20100130-08:00:52|10=136|',
        checksumValid: true,
        bodyLengthValid: true,
    },
    {
        description: 'ExecutionReport',
        detail: '',
        fix:
            '8=FIX.4.2|9=262|35=8|49=ABC|56=XYZ|50=AZ12|57=NA|34=834|52=20100130-08:00:52.008|55=GLD|48=PL11YA|167=FUT|207=LIFFE|1=AA1|37=ABC2|17=93OOO|58=Fill|200=201009|205=13|32=25|151=0|14=25|54=2|40=2|77=O|59=0|150=2|20=0|39=2|442=1|44=99.06|38=25|31=99.06|6=99.06|60=20100130-08:00:52|10=053|',
        checksumValid: true,
        bodyLengthValid: true,
    },
    {
        description: 'TradeCaptureReport',
        detail: '',
        fix:
            '8=FIX.4.2|9=178|35=AE|56=LSEHub|49=BROKERX|128=LSETR|34=2175|52=20120126-15:15:54|918=GBP|31=89.0000000|64=20120126|828=1|60=20120126-13:32:49|32=6|22=4|571=124|43=N|570=N|150=0|48=GB0007188757|10=206|',
        checksumValid: true,
        bodyLengthValid: true,
    },
    {
        description: 'TradeCaptureReportAck',
        detail: '',
        fix:
            '8=FIX.4.2|9=112|35=AR|49=LSEHub|56=BROKERX|115=LSETR|34=2006|52=20120126-15:15:54|370=20120126-15:15:54.822|571=124|150=0|939=0|10=059|',
        checksumValid: true,
        bodyLengthValid: true,
    },
    {
        description: 'TradeCaptureReport',
        detail: '',
        fix:
            '8=FIX.4.2|9=130|35=AE|49=LSEHub|56=LSETR|115=BROKERX|34=2287|43=N|52=20120330-12:14:09|370=20120330-12:14:09.816|571=00008661533TRLO1-1-1-0|150=H|10=074|',
        checksumValid: true,
        bodyLengthValid: true,
    },
    {
        description: 'TradeCaptureReportAck',
        detail: '',
        fix:
            '8=FIX.4.2|9=109|35=AR|34=2486|49=LSETR|52=20120330-12:14:10.379|56=LSEHub|128=BROKERX|150=H|571=00008661533TRLO1-1-1-0|939=0|10=073|',
        checksumValid: true,
        bodyLengthValid: true,
    },
    {
        description: 'TradeCaptureReport',
        detail: '',
        fix:
            '8=FIX.4.2|9=175|35=AE|49=BROKERX|56=LSEHub|34=17|52=20120202-16:04:44|128=LSETR|918=EUR|31=89.0000000|64=20120202|828=1007|60=20120202-16:04:44|32=6|22=4|571=1698|570=N|150=0|48=AT0000785555|10=076|',
        checksumValid: true,
        bodyLengthValid: true,
    },
    {
        description: 'TradeCaptureReportAck',
        detail: '',
        fix:
            '8=FIX.4.2|9=111|35=AR|49=LSEHub|56=BROKERX|115=LSETR|34=16|52=20120202-16:04:44|370=20120202-16:04:45.257|571=1698|150=0|939=0|10=015|',
        checksumValid: true,
        bodyLengthValid: true,
    },
    {
        description: 'Logon',
        detail: '',
        fix:
            '8=FIX.4.19=69035=A49=INVMGR56=BRKR98=590=62591=-----BEGIN PGP MESSAGE----- Version: 2.7.1  hIwDDrony+hQ+FEBA/9qd5Vcdw2w2DSKx3+XbqOhWz9xZ07RYRyhKDG/qE5EQbYu 6srrDowCzscPb9+krWcxH4xL3B/1DEwL3QpQsxCSGY1JnbjDCTyJ21nuZ6NHY6YA AAECr4mTIlZgM5hmSmrlunDoeOQWwPkca9OCWh0n3VXfGkA7e99DCq0P3MZ48Jlr GNF141hwWLIpN2RfqYvfzPD0w7I54wf3z/sYefGj+a0QTt1JOLEFxzsPykIyMPEI kGfdjuzOL8/94plkeeWSJHx7K6IemVRsT6HwLJtFaW/JIJr+hxYr1Z8BBjyXoQCz argut9niFOcnSqwvZolAYqjMPrkWuaeJn+bJ4kCEuLGdrQJDHvlzOS6r3By80IUc 2L4W7yJL7Am82wTWD4s5ANBQz8FCwLtLMivUTvqsg/Zp8v7vSQ1FfEIsg30XXtBL 6QBYtnYnAAAwCEOrv6DavDTfhWl72D6VfiOLrHIHtEQf3iwb5JFHGRaMpX88VlSU W7qy163o78rIEL3WEak4pwmnf28P =v9gz -----END PGP MESSAGE----- 93=1689=................10=161',
        checksumValid: false,
        bodyLengthValid: true,
    },
    {
        description: 'Logon',
        detail: '',
        fix:
            '8=FIX.4.19=6135=A34=149=EXEC52=20121105-23:24:0656=BANZAI98=0108=3010=0038=FIX.4.19=6135=A34=149=BANZAI52=20121105-23:24:0656=EXEC98=0108=3010=0038=FIX.4.19=4935=034=249=BANZAI52=20121105-23:24:3756=EXEC10=2288=FIX.4.19=4935=034=249=EXEC52=20121105-23:24:3756=BANZAI10=2288=FIX.4.19=10335=D34=349=BANZAI52=20121105-23:24:4256=EXEC11=135215788257721=138=1000040=154=155=MSFT59=010=0628=FIX.4.19=13935=834=349=EXEC52=20121105-23:24:4256=BANZAI6=011=135215788257714=017=120=031=032=037=138=1000039=054=155=MSFT150=2151=010=0598=FIX.4.19=15335=834=449=EXEC52=20121105-23:24:4256=BANZAI6=12.311=135215788257714=1000017=220=031=12.332=1000037=238=1000039=254=155=MSFT150=2151=010=2308=FIX.4.19=10335=D34=449=BANZAI52=20121105-23:24:5556=EXEC11=135215789503221=138=1000040=154=155=ORCL59=010=0478=FIX.4.19=13935=834=549=EXEC52=20121105-23:24:5556=BANZAI6=011=135215789503214=017=320=031=032=037=338=1000039=054=155=ORCL150=2151=010=0498=FIX.4.19=15335=834=649=EXEC52=20121105-23:24:5556=BANZAI6=12.311=135215789503214=1000017=420=031=12.332=1000037=438=1000039=254=155=ORCL150=2151=010=2208=FIX.4.19=10835=D34=549=BANZAI52=20121105-23:25:1256=EXEC11=135215791235721=138=1000040=244=1054=155=SPY59=010=0038=FIX.4.19=13835=834=749=EXEC52=20121105-23:25:1256=BANZAI6=011=135215791235714=017=520=031=032=037=538=1000039=054=155=SPY150=2151=010=2528=FIX.4.19=10435=F34=649=BANZAI52=20121105-23:25:1656=EXEC11=135215791643738=1000041=135215791235754=155=SPY10=1988=FIX.4.19=8235=334=849=EXEC52=20121105-23:25:1656=BANZAI45=658=Unsupported message type10=0008=FIX.4.19=10435=F34=749=BANZAI52=20121105-23:25:2556=EXEC11=135215792530938=1000041=135215791235754=155=SPY10=1978=FIX.4.19=8235=334=949=EXEC52=20121105-23:25:2556=BANZAI45=758=Unsupported message type10=002',
        checksumValid: true,
        bodyLengthValid: true,
        numMessages: 16,
    },
    {
        description: 'Logon',
        detail: '',
        fix:
            '8=FIX.4.29=6935=A34=1249=SENDER52=20140228-05:42:38.02656=TARGET98=0108=12010=238',
        checksumValid: true,
        bodyLengthValid: true,
    },
    {
        description: 'Logon',
        detail: '',
        fix:
            '8=FIX.4.29=6935=A34=1849=TARGET52=20140228-05:42:38.05456=SENDER98=0108=12010=245',
        checksumValid: true,
        bodyLengthValid: true,
    },
    {
        description: 'NewOrderSingle',
        detail: '',
        fix:
            '8=FIX.4.29=12835=D34=1349=SENDER52=20140228-05:42:52.25856=TARGET11=139356617224438=10040=154=155=TEST59=060=20140228-05:42:52.25610=155',
        checksumValid: true,
        bodyLengthValid: true,
    },
    {
        description: 'Reject',
        detail: '',
        fix:
            '8=FIX.4.29=10235=334=1949=TARGET52=20140228-05:42:52.27956=SENDER45=1358=Required tag missing, field=21372=D10=067',
        checksumValid: true,
        bodyLengthValid: true,
    },
    {
        description: 'NewOrderSingle',
        detail: '',
        fix:
            '8=FIX.4.29=14535=D34=1449=SENDER52=20140228-05:43:10.53156=TARGET11=139356619053321=138=20040=244=45.6754=155=FIXSPEC59=060=20140228-05:43:10.53110=216',
        checksumValid: true,
        bodyLengthValid: true,
    },
    {
        description: 'ExecutionReport',
        detail: '',
        fix:
            '8=FIX.4.29=15135=834=2049=TARGET52=20140228-05:43:10.54356=SENDER6=011=139356619053314=017=020=037=139356619053338=20039=054=155=FIXSPEC150=0151=20010=129',
        checksumValid: true,
        bodyLengthValid: true,
    },
    {
        description: 'ExecutionReport',
        detail: '',
        fix:
            '8=FIX.4.29=17135=834=2349=TARGET52=20140228-05:43:21.88656=SENDER6=45.6711=139356619053314=7517=320=031=45.6732=7537=139356619053338=20039=154=155=FIXSPEC150=1151=12510=098',
        checksumValid: true,
        bodyLengthValid: true,
    },
    {
        description: 'ExecutionReport',
        detail: '',
        fix:
            '8=FIX.4.29=17135=834=2649=TARGET52=20140228-05:43:27.32656=SENDER6=45.6711=139356619053314=20017=620=031=45.6732=12537=139356619053338=20039=254=155=FIXSPEC150=2151=010=079',
        checksumValid: true,
        bodyLengthValid: true,
    },
    {
        description: 'NewOrderSingle',
        detail: '',
        fix:
            '8=FIX.4.29=14135=D34=2049=SENDER52=20140228-05:45:28.37356=TARGET11=139356632838121=138=12540=244=34.754=255=EXAM59=060=20140228-05:45:28.37310=219',
        checksumValid: true,
        bodyLengthValid: true,
    },
    {
        description: 'ExecutionReport',
        detail: '',
        fix:
            '8=FIX.4.29=14935=834=2849=TARGET52=20140228-05:45:28.37556=SENDER6=011=139356632838114=017=1020=037=139356632838138=12539=054=255=EXAM150=0151=12510=253',
        checksumValid: true,
        bodyLengthValid: true,
    },
    {
        description: 'Heartbeat',
        detail: '',
        fix:
            '8=FIX.4.29=5635=034=2949=TARGET52=20140228-05:47:28.55456=SENDER10=162',
        checksumValid: true,
        bodyLengthValid: true,
    },
    {
        description: 'TestRequest',
        detail: '',
        fix:
            '8=FIX.4.29=6535=134=3049=TARGET52=20140228-05:48:28.55356=SENDER112=TEST10=173',
        checksumValid: true,
        bodyLengthValid: true,
    },
    {
        description: 'Heartbeat',
        detail: '',
        fix:
            '8=FIX.4.29=6535=034=2149=SENDER52=20140228-05:48:28.55456=TARGET112=TEST10=173',
        checksumValid: true,
        bodyLengthValid: true,
    },
    {
        description: 'NewOrderSingle',
        detail: '',
        fix:
            '8=FIX.4.2|9=153|35=D|49=BLP|56=SCHB|34=1|50=30737|97=Y|52=20000809-20:20:50|11=90001008|1=10030003|21=2|55=TESTA|54=1|38=4000|40=2|59=0|44=30|47=I|60=20000809-18:20:32|10=061|',
        checksumValid: false,
        bodyLengthValid: false,
    },
    {
        description: 'ExecutionReport',
        detail: '',
        fix: '8=FIX.4.4\x019=1753\x0135=8\x01523=S|E|B Auto-pricing\x01',
        checksumValid: false,
        bodyLengthValid: false,
    },
    {
        description: 'XMLnonFIX',
        detail: 'FIX 5',
        fix:
            '8=FIXT.1.19=996935=n34=35249=SOURCE52=20170808-12:08:08.06056=TARGET212=9885213=<foo/>10=211',
        checksumValid: false,
        bodyLengthValid: false,
    },
    {
        description: 'SequenceReset',
        detail: '',
        fix:
            '8=FIX.4.4|9=70|35=4|49=A|56=XYZ|34=129|52=20100302-19:38:21|43=Y|57=LOL|123=Y|36=175|10=192|',
        checksumValid: true,
        bodyLengthValid: true,
    },
    {
        description: 'NewOrderSingle',
        detail: '',
        fix:
            '8=FIX.4.4|9=122|35=D|34=215|49=CLIENT12|52=20100225-19:41:57.316|56=B|1=Marcel|11=13346|21=1|40=2|44=5|54=1|59=0|60=20100225-19:39:52.020|10=072|',
        checksumValid: true,
        bodyLengthValid: true,
    },
    {
        description: 'MarketDataIncrementalRefresh',
        detail: '',
        fix:
            '8=FIX.4.2|9=196|35=X|49=A|56=B|34=12|52=20100318-03:21:11.364|262=A|268=2|279=0|269=0|278=BID|55=EUR/USD|270=1.37215|15=EUR|271=2500000|346=1|279=0|269=1|278=OFFER|55=EUR/USD|270=1.37224|15=EUR|271=2503200|346=1|10=171|',
        checksumValid: true,
        bodyLengthValid: true,
    },
    {
        description: 'Heartbeat',
        detail: '',
        fix: '8=FIX.4.2|9=42|35=0|49=A|56=B|34=12|52=20100304-07:59:30|10=185|',
        checksumValid: true,
        bodyLengthValid: true,
    },
    {
        description: 'IOI',
        detail: '',
        fix:
            '8=FIX.4.2|9=97|35=6|49=BKR|56=IM|34=14|52=20100204-09:18:42|23=115685|28=N|55=SPMI.MI|54=2|44=2200.75|27=S|25=H|10=248|',
        checksumValid: true,
        bodyLengthValid: true,
    },
    {
        description: 'NewOrderSingle',
        detail: '',
        fix:
            '8=FIX.4.4|9=122|35=D|34=215|49=CLIENT12|52=20100225-19:41:57.316|56=B|1=Marcel|11=13346|21=1|40=2|44=5|54=1|59=0|60=20100225-19:39:52.020|10=072|',
        checksumValid: true,
        bodyLengthValid: true,
    },
    {
        description: 'TradeCaptureReportRequest',
        detail: '',
        fix:
            '8=FIX.4.4|9=117|35=AD|34=2|49=A|50=1|52=20100219-14:33:32.258|56=B|57=M|263=1|568=1|569=0|580=1|75=20100218|60=20100218-00:00:00.000|10=202|',
        checksumValid: true,
        bodyLengthValid: true,
    },
    {
        description: 'Reject',
        detail: '',
        fix:
            '8=FIX.4.4|9=94|35=3|34=214|49=A|50=U1|52=20100304-09:42:23.130|56=AB|128=B1|45=176|58=txt|371=15|372=X|373=1|10=058|',
        checksumValid: true,
        bodyLengthValid: true,
    },
    {
        description: 'MarketDataSnapshotFullRefresh',
        detail: '',
        fix:
            '8=FIX.4.4|9=140|35=W|34=39630|52=20181029-11:11:28.985|49=FXAGGR_RATES|56=u2071|55=EURUSD|268=2|269=0|270=1.14073|271=1400000|269=1|270=1.14074|271=2800000|10=092|',
        checksumValid: true,
        bodyLengthValid: true,
    },
];

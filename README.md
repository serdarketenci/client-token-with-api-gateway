## Client Token with API Gateway


## Uygulama Çalıştırma

Uygulama multiple project çalışacak şekilde konfigüre edilmiştir. MongoDB yüklü olması gerekmektedir.

Visual Studio üzerinde F5 tuşuna basılarak çalıştırılabilir.

Front end için: http://localhost:44317/

Back end için: http://localhost:44301/

Admin kullanıcının oluşturulması için aşağıdaki shell scripti MongoDB üzerinde çalıştırılmalıdır.

```shell
show dbs
use identity
db.getCollection("users").insertOne({
	"_id" : BinData(3,"xYYB/6XDaEaWQYP9/BEVcQ=="),
	"Email" : "admin@iku.edu.tr",
	"Password" : "tabSdQLDL9r29Mek9PvWnw9kM61CT3klw0pOZBQhAskqW11/4zpEpA==",
	"Salt" : "BCHatrzmOgciBaIW/DjLgw/lCCbBNNWxGvL1C25mZHaxgTBAfolOVA==",
	"IsAdmin" : true
})



```



## Uygulama Kurulumu

Terminal üzerinde .sln olduğu path e gelip, aşağıdaki docker komutunun çalıştırılmasıyla kurulum gerçekleştirilecektir.

```
docker-compose up
```

module GlareSim {
    export class FileIo {
        public GameParameters: GameParameters

        public LoadParametersFromFileAsync(fileName: string, whenDone: () => any) {
            var gameParams = null;
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET", fileName, true);
            xmlhttp.onreadystatechange = () => {                
                if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                    xmlhttp.onreadystatechange = null;
                    this.GameParameters = new GameParameters(xmlhttp.responseText);
                    whenDone();
                }
            };
            xmlhttp.send(null);
        }
    }
}
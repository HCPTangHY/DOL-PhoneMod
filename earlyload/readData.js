(async() => {
    function parse_YAML(yamlString) {
        const lines = yamlString.split('\n');
        const result = {};

        let currentObject = result;
        let indentLevel = 0;

        for (let line of lines) {
            if (line.trim() === '') continue;

            const leadingSpaces = line.match(/^\s*/)[0].length;
            const currentIndentLevel = leadingSpaces / 2;

            line = line.trim();

            if (currentIndentLevel < indentLevel) {
                currentObject = result;
            }

            indentLevel = currentIndentLevel;

            const [key, value] = line.split(':');

            if (!value || value.trim() === '') {
                currentObject[key.trim()] = {};
                currentObject = currentObject[key.trim()];
            } else {
                currentObject[key.trim()] = value.trim();
            }
        }
        return result;
    }

    let mod = window.modSC2DataManager.getModLoader().getModByNameOne("PhoneMod");
    let addtionFlies = mod.mod.bootJson.additionFile;
    let l = {};
    for (f of addtionFlies) {
        if (f.search("localization") != -1) {
            let file = await (mod.zip.zip.file(f).async("string"));
            localization = window.parse_YAML(file);
            let lanKey = Object.keys(localization)[0]
            if (l[lanKey]) {
                Object.assign(l[lanKey], localization[lanKey])
            } else {
                Object.defineProperty(l, lanKey, { value: localization[lanKey] })
            }
            console.log(l)
        }
    }
    Object.defineProperty(window, 'PhoneModlocalization', { value: l });
    window.L = function(key) {
        if (!window.PhoneModlocalization[navigator.language]) {
            return key
        } else {
            if (!window.PhoneModlocalization[navigator.language][key]) {
                return key
            } else {
                return window.PhoneModlocalization[navigator.language][key]
            }
        }
    }
})();
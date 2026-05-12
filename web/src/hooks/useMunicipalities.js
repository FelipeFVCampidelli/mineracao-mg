import { useState, useEffect } from 'react'

const cache = {}

const MESO_CODES = {
    mg: {
        'noroeste-de-minas': 3101,
        'norte-de-minas': 3102,
        'jequitinhonha': 3103,
        'vale-do-mucuri': 3104,
        'triangulo-mineiro': 3105,
        'central-mineira': 3106,
        'metropolitana-bh': 3107,
        'vale-do-rio-doce': 3108,
        'oeste-de-minas': 3109,
        'sul-sudoeste': 3110,
        'campo-das-vertentes': 3111,
        'zona-da-mata': 3112,
    }
}

export function useMunicipalities(stateId, regionId) {
    const [municipalities, setMunicipalities] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!stateId || !regionId) return
        const key = `${stateId}:${regionId}`

        if (cache[key]) {
            setMunicipalities(cache[key])
            setLoading(false)
            return
        }

        const code = MESO_CODES[stateId]?.[regionId]
        if (!code) { setLoading(false); return }

        fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/mesorregioes/${code}/municipios`)
            .then(r => r.json())
            .then(data => {
                const names = data.map(m => m.nome).sort((a, b) => a.localeCompare(b, 'pt'))
                cache[key] = names
                setMunicipalities(names)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [stateId, regionId])

    return { municipalities, loading }
}
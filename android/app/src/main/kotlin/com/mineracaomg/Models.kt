package com.mineracaomg

import androidx.compose.ui.graphics.Color
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

// MARK: - AppLocale

enum class AppLocale(val label: String) {
    PT("PT"), EN("EN"), ES("ES");

    companion object {
        fun fromSystem(): AppLocale {
            return when (java.util.Locale.getDefault().language) {
                "en" -> EN
                "es" -> ES
                else -> PT
            }
        }
    }
}

// MARK: - Mineral

@Serializable
data class Mineral(
    val id: String,
    val title: String,
    @SerialName("title_en") val titleEn: String? = null,
    @SerialName("title_es") val titleEs: String? = null,
    val description: String = "",
    @SerialName("description_en") val descriptionEn: String? = null,
    @SerialName("description_es") val descriptionEs: String? = null,
    val photo: String? = null,
    val source: String? = null,
    val symbol: String? = null,
    val tagline: String? = null,
    @SerialName("tagline_en") val taglineEn: String? = null,
    @SerialName("tagline_es") val taglineEs: String? = null,
) {
    fun localizedTitle(locale: AppLocale): String = when (locale) {
        AppLocale.EN -> titleEn?.takeIf { it.isNotBlank() } ?: title
        AppLocale.ES -> titleEs?.takeIf { it.isNotBlank() } ?: title
        AppLocale.PT -> title
    }

    fun localizedDescription(locale: AppLocale): String = when (locale) {
        AppLocale.EN -> descriptionEn?.takeIf { it.isNotBlank() } ?: description
        AppLocale.ES -> descriptionEs?.takeIf { it.isNotBlank() } ?: description
        AppLocale.PT -> description
    }

    fun localizedTagline(locale: AppLocale): String = when (locale) {
        AppLocale.EN -> taglineEn?.takeIf { it.isNotBlank() } ?: tagline ?: ""
        AppLocale.ES -> taglineEs?.takeIf { it.isNotBlank() } ?: tagline ?: ""
        AppLocale.PT -> tagline ?: ""
    }

    val badgeColor: Color get() = parseHexColor(badgePalette[id] ?: "#666666")

    companion object {
        private val badgePalette = mapOf(
            "ferro"        to "#8B4513",
            "ouro"         to "#B8860B",
            "diamante"     to "#5B8DB8",
            "granito"      to "#696969",
            "litio"        to "#607D8B",
            "calcario"     to "#8D7355",
            "niobio"       to "#3B5EA6",
            "fosfato"      to "#4A7C59",
            "prata"        to "#9E9E9E",
            "chumbo"       to "#6B7B8D",
            "tantalo"      to "#4A6FA5",
            "bauxita"      to "#A0522D",
            "quartzo"      to "#7986CB",
            "zinco"        to "#5B7FA6",
            "estanho"      to "#9E7E5A",
            "caulim"       to "#A0948A",
            "silica"       to "#4B8BBE",
            "terra-rara"   to "#7B4F9E",
            "manganes"     to "#757575",
            "niquel"       to "#78909C",
            "agua-mineral" to "#1565C0",
            "cobre"        to "#B87333",
        )

        fun parseHexColor(hex: String): Color {
            return try {
                Color(android.graphics.Color.parseColor(hex))
            } catch (e: Exception) {
                Color(0xFF666666.toInt())
            }
        }
    }
}

// MARK: - Region

data class Region(
    val id: String,
    val name: String,
    val colorHex: String,
    val ibgeCode: Int,
) {
    val color: Color get() = Mineral.parseHexColor(colorHex)
    val colorArgb: Int get() = try { android.graphics.Color.parseColor(colorHex) } catch (e: Exception) { android.graphics.Color.GRAY }

    companion object {
        val all = listOf(
            Region("jequitinhonha",       "Jequitinhonha",       "#FF00FF", 3103),
            Region("norte-de-minas",      "Norte de Minas",      "#7B4F2E", 3102),
            Region("noroeste-de-minas",   "Noroeste de Minas",   "#A8B8C8", 3101),
            Region("triangulo-mineiro",   "Triângulo Mineiro",   "#7ECECA", 3105),
            Region("sul-sudoeste",        "Sul e Sudoeste",      "#6B2D8B", 3110),
            Region("central-mineira",     "Central Mineira",     "#00BCD4", 3106),
            Region("oeste-de-minas",      "Oeste de Minas",      "#C8B400", 3109),
            Region("campo-das-vertentes", "Campo das Vertentes", "#787878", 3111),
            Region("metropolitana-bh",    "Metropolitana de BH", "#D2691E", 3107),
            Region("zona-da-mata",        "Zona da Mata",        "#1A3EBF", 3112),
            Region("vale-do-rio-doce",    "Vale do Rio Doce",    "#2E8B57", 3108),
            Region("vale-do-mucuri",      "Vale do Mucuri",      "#A52A2A", 3104),
        )

        fun find(id: String): Region? = all.firstOrNull { it.id == id }
    }
}

// MARK: - Sheet destination

sealed class SheetScreen {
    data object Home : SheetScreen()
    data class MineralDetail(val mineralId: String) : SheetScreen()
    data object Municipalities : SheetScreen()
}

/**
 * @module Components/UI
 * @description Компонент ігрової сітки (поля).
 * Відповідає за рендеринг ігрового поля розміром 5x5, відображення підписів осей (А-Д, 1-5),
 * а також керує логікою відображення кораблів та прев'ю розстановки.
 */

import React from "react";
import styles from "./Grid.module.css";
import { GRID_SIZE, LETTERS } from "../constants/gameConstants";
import { Cell } from "./Cell.jsx";

/**
 * Компонент Grid.
 * * @component
 * @param {Object} props - Властивості компонента.
 * @param {Array<Object>} [props.ships=[]] - Масив об'єктів кораблів, розміщених на полі.
 * @param {Function} [props.onCellClick] - Обробник кліку по клітинці (наприклад, для пострілу).
 * @param {Function} [props.onCellHover] - Обробник наведення на клітинку (для логіки прев'ю).
 * @param {string[]} [props.previewPositions=[]] - Масив координат клітинок, які мають підсвічуватися як прев'ю.
 * @param {boolean} [props.isHoverValid=false] - Чи є поточне прев'ю допустимим (валідним) для розміщення.
 * @param {boolean} [props.showShips=true] - Чи потрібно показувати кораблі (false для ворожого поля).
 * @param {boolean} [props.isEnemy=false] - Прапор, що вказує, чи є це поле ворожим.
 * @param {Object.<string, string>} [props.cellStates={}] - Об'єкт станів клітинок, де ключ — координата, а значення — стан ("hit", "miss", "sunk").
 * * @returns {JSX.Element} Рендерить контейнер із сіткою клітинок та мітками осей.
 */
export function Grid({
                         ships = [],
                         onCellClick,
                         onCellHover,
                         previewPositions = [],
                         isHoverValid = false,
                         showShips = true,
                         isEnemy = false,
                         cellStates = {},
                     }) {
    const size = GRID_SIZE;

    /** @type {Set<string>} Множина координат, зайнятих кораблями (якщо їх дозволено показувати) */
    const occupied = new Set(showShips ? ships.flatMap((s) => s.positions) : []);

    /** @type {Set<string>} Множина координат для підсвічування прев'ю */
    const previewSet = new Set(previewPositions);

    return (
        <div className={`${styles.wrapper} ${isEnemy ? styles.enemy : styles.ally}`}>

            {/* Рендеринг верхнього рядка з літерами (А-Д) */}
            <div className={styles.lettersRow}>
                <div className={styles.corner} />
                {LETTERS.map((l) => (
                    <div key={l} className={styles.label}>{l}</div>
                ))}
            </div>

            {/* Рендеринг основної області сітки та бокових цифр (1-5) */}
            <div className={styles.gridArea}>
                {Array.from({ length: size }).map((_, r) => (
                    <div key={r} className={styles.row}>

                        <div className={styles.label}>{r + 1}</div>

                        {Array.from({ length: size }).map((__, c) => {
                            const coord = `${LETTERS[c]}${r + 1}`;
                            const hasShip = occupied.has(coord);
                            const state = cellStates[coord] ?? "empty";

                            // Визначення класу для прев'ю
                            const isPreview = previewSet.has(coord);
                            const previewClass = isPreview
                                ? (isHoverValid ? "previewValid" : "previewInvalid")
                                : "";

                            return (
                                <Cell
                                    key={coord}
                                    coord={coord}
                                    hasShip={hasShip}
                                    isEnemy={isEnemy}
                                    state={state}
                                    onClick={onCellClick}
                                    onMouseEnter={onCellHover ? () => onCellHover(coord) : undefined}
                                    onMouseLeave={onCellHover ? () => onCellHover(null) : undefined}
                                    extraClass={previewClass}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}

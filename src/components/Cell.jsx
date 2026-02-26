/**
 * @module Components/UI
 * @description Атомарний компонент клітинки ігрового поля.
 * Відповідає за відображення стану клітинки (пусто, влучання, промах, потоплено)
 * та обробку подій взаємодії. Використовує React.memo для оптимізації рендерингу.
 */

import React from "react";
import styles from "./Cell.module.css";

/**
 * Компонент Cell.
 * * @component
 * @param {Object} props - Властивості компонента.
 * @param {string} props.coord - Координата клітинки (напр. "A1"). Обов'язкова.
 * @param {boolean} [props.hasShip=false] - Чи розміщений корабель у цій клітинці.
 * @param {boolean} [props.isEnemy=false] - Чи належить клітинка ворожому полю (приховує кораблі).
 * @param {('empty'|'hit'|'miss'|'sunk')} [props.state="empty"] - Поточний візуальний стан клітинки.
 * @param {Function} [props.onClick] - Коллбек-функція при натисканні на клітинку.
 * @param {Function} [props.onMouseEnter] - Обробник події наведення курсору (для прев'ю розстановки).
 * @param {Function} [props.onMouseLeave] - Обробник події виходу курсору за межі клітинки.
 * @param {string} [props.extraClass=""] - Додатковий CSS-клас із модуля (напр. для підсвічування прев'ю).
 * @returns {JSX.Element|null} Рендерить інтерактивну клітинку або null, якщо координата не передана.
 */
export const Cell = React.memo(function Cell({
                                                 coord,
                                                 hasShip = false,
                                                 isEnemy = false,
                                                 state = "empty",
                                                 onClick,
                                                 onMouseEnter,
                                                 onMouseLeave,
                                                 extraClass = "",
                                             }) {
    if (coord === undefined) return null;

    const classList = [styles.cell];

    // кораблі гравця
    if (!isEnemy && hasShip) classList.push(styles.allyShip);

    // стани
    if (state === "hit") classList.push(styles.hit);
    if (state === "miss") classList.push(styles.miss);
    if (state === "sunk") classList.push(styles.sunk);

    // Додавання класів прев'ю (через динамічний доступ до об'єкта стилів)
    if (extraClass && styles[extraClass]) {
        classList.push(styles[extraClass]);
    }

    return (
        <div
            className={classList.join(" ")}
            onClick={onClick ? () => onClick(coord) : undefined}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={
                onClick
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            onClick(coord);
                        }
                    }
                    : undefined
            }
            aria-label={`Клітинка ${coord}${
                hasShip ? ", містить корабель" : ""
            }, стан: ${state}`}
        />
    );
});

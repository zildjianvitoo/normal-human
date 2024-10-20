// ResultItem.tsx
import { motion } from "framer-motion";
import { forwardRef, Fragment, useMemo } from "react";
import type { ActionImpl, ActionId } from "kbar";

const ResultItem = forwardRef(
  (
    {
      action,
      active,
      currentRootActionId,
    }: {
      action: ActionImpl;
      active: boolean;
      currentRootActionId: ActionId;
    },
    ref: React.Ref<HTMLDivElement>,
  ) => {
    const ancestors = useMemo(() => {
      if (!currentRootActionId) return action.ancestors;
      const index = action.ancestors.findIndex(
        (ancestor) => ancestor.id === currentRootActionId,
      );
      return action.ancestors.slice(index + 1);
    }, [action.ancestors, currentRootActionId]);

    return (
      <div
        ref={ref}
        className={`relative z-10 flex cursor-pointer items-center justify-between px-4 py-3`}
      >
        {active && (
          <motion.div
            layoutId="kbar-result-item"
            className="absolute inset-0 !z-[-1] border-l-4 border-black bg-gray-200 dark:border-white dark:bg-gray-700"
            transition={{
              duration: 0.14,
              type: "spring",
              ease: "easeInOut",
            }}
          ></motion.div>
        )}
        <div className="relative z-10 flex items-center gap-2">
          {action.icon && action.icon}
          <div className="flex flex-col">
            <div>
              {ancestors.length > 0 &&
                ancestors.map((ancestor) => (
                  <Fragment key={ancestor.id}>
                    <span className="mr-2 opacity-50">{ancestor.name}</span>
                    <span className="mr-2">&rsaquo;</span>
                  </Fragment>
                ))}
              <span>{action.name}</span>
            </div>
            {action.subtitle && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {action.subtitle}
              </span>
            )}
          </div>
        </div>
        {action.shortcut?.length ? (
          <div className="relative z-10 grid grid-flow-col gap-1">
            {action.shortcut.map((sc) => (
              <kbd
                key={sc}
                className="flex items-center gap-1 rounded-md border border-gray-200 bg-gray-50 px-1.5 py-1 text-xs font-medium text-gray-600 shadow dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
              >
                {sc}
              </kbd>
            ))}
          </div>
        ) : null}
      </div>
    );
  },
);
ResultItem.displayName = "ResultItem";
export default ResultItem;

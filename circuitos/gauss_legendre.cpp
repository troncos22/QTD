#include <iostream>
#include <vector>
#include <cmath>
#include <functional>
#include <iomanip>

struct QuadratureRule {
    std::vector<double> nodes;
    std::vector<double> weights;
};

// Computes nodes and weights on [-1, 1] using Newton-Raphson
QuadratureRule compute_gauss_legendre(int n, double tol = 1e-15, int max_iter = 100) {
    QuadratureRule rule;
    rule.nodes.resize(n);
    rule.weights.resize(n);

    const double pi = std::acos(-1.0);
    int m = (n + 1) / 2; // Symmetric roots

    for (int i = 0; i < m; ++i) {
        // Initial Chebyshev-Gauss approximation for the root
        double z = std::cos(pi * (i + 0.75) / (n + 0.5));
        double pp = 0.0; // Derivative P'_n(z)

        for (int iter = 0; iter < max_iter; ++iter) {
            double p1 = 1.0;
            double p2 = 0.0;

            // Bonnet's recurrence relation to evaluate P_n(z)
            for (int j = 1; j <= n; ++j) {
                double p3 = p2;
                p2 = p1;
                p1 = ((2.0 * j - 1.0) * z * p2 - (j - 1.0) * p3) / j;
            }

            // Derivative of P_n using the relation:
            // (1 - z^2) * P'_n(z) = n * (P_{n-1}(z) - z * P_n(z))
            pp = n * (p2 - z * p1) / (1.0 - z * z);

            double z_old = z;
            z = z - p1 / pp;

            if (std::abs(z - z_old) < tol) {
                break;
            }
        }

        // Store symmetric roots and weights
        rule.nodes[i] = -z;
        rule.nodes[n - 1 - i] = z;

        double w = 2.0 / ((1.0 - z * z) * pp * pp);
        rule.weights[i] = w;
        rule.weights[n - 1 - i] = w;
    }

    return rule;
}

// Integrates f(x) over [a, b] using precomputed nodes and weights
double integrate_gauss_legendre(const std::function<double(double)>& f, 
                                double a, double b, 
                                const QuadratureRule& rule) {
    double half_length = 0.5 * (b - a);
    double mid_point = 0.5 * (a + b);
    double sum = 0.0;

    for (size_t i = 0; i < rule.nodes.size(); ++i) {
        double x_mapped = half_length * rule.nodes[i] + mid_point;
        sum += rule.weights[i] * f(x_mapped);
    }

    return half_length * sum;
}

int main() {

    int n = 6; // Para funciones trascendentes como sin(x)/x, n = 5 da alta precisión
    QuadratureRule rule = compute_gauss_legendre(n);

    double a = 0.0;
    double b = 1.0;

    // 1. Integración directa sobre [0, 1]
    auto f = [](double x) {
        return (std::abs(x) < 1e-15) ? 1.0 : (std::sin(x) / x);
    };
    double result = integrate_gauss_legendre(f, a, b, rule);

    // 2. Si quieres mapear manualmente a [-1, 1], la integral de f(t) en [0, 1]
    // equivale a: integral de -1 a 1 de [ f((t+1)/2) * (1/2) ] dt
    // Nota el factor 0.5 correspondiente al jacobiano dt/dx = 1/2
    double a_2 = -1.0;
    double b_2 = 1.0;
    auto f_2 = [](double t) {
        double x = (t + 1.0) / 2.0;
        double fx = (std::abs(x) < 1e-15) ? 1.0 : (std::sin(x) / x);
        return 0.5 * fx;
    };
    double result_2 = integrate_gauss_legendre(f_2, a_2, b_2, rule);

    // Valor de referencia: Si(1)
    double exact = 0.946083070367183;

    std::cout << std::setprecision(15);
    std::cout << "Computed (directo [0, 1]):      " << result << "\n";
    std::cout << "Computed 2 (mapeo a [-1, 1]):    " << result_2 << "\n";
    std::cout << "Exact (Si(1)):                  " << exact << "\n";

    return 0;
}